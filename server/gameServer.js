const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

class GameServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // Game state
    this.waitingPlayers = []; // Queue for public matchmaking
    this.privateLobby = {}; // Private lobbies by code
    this.activeGames = {}; // Active games by gameId
    this.playerSockets = {}; // Socket ID to player info mapping

    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Player connected: ${socket.id}`);

      // Handle player setup
      socket.on('player:setup', (playerData) => {
        this.playerSockets[socket.id] = {
          ...playerData,
          socketId: socket.id,
          connected: true
        };
        console.log(`Player setup: ${playerData.username} (${socket.id})`);
      });

      // Handle public matchmaking
      socket.on('matchmaking:join', () => {
        const player = this.playerSockets[socket.id];
        if (!player) {
          socket.emit('error', { message: 'Player not set up' });
          return;
        }

        console.log(`${player.username} joined matchmaking queue`);
        
        // Add to queue
        this.waitingPlayers.push(socket.id);
        socket.emit('matchmaking:searching');

        // Try to match immediately
        this.tryMatchPlayers();
      });

      // Handle leaving matchmaking
      socket.on('matchmaking:leave', () => {
        const index = this.waitingPlayers.indexOf(socket.id);
        if (index > -1) {
          this.waitingPlayers.splice(index, 1);
          console.log(`Player ${socket.id} left matchmaking`);
        }
      });

      // Handle private lobby creation
      socket.on('lobby:create', (gameConfig) => {
        const player = this.playerSockets[socket.id];
        if (!player) {
          socket.emit('error', { message: 'Player not set up' });
          return;
        }

        // Generate 5-digit code
        const code = this.generateLobbyCode();
        
        this.privateLobby[code] = {
          code,
          host: socket.id,
          guest: null,
          gameConfig,
          createdAt: Date.now()
        };

        socket.join(`lobby-${code}`);
        socket.emit('lobby:created', {
          code,
          host: {
            username: player.username,
            avatar: player.avatar,
            ready: true
          }
        });

        console.log(`Private lobby created: ${code} by ${player.username}`);
      });

      // Handle private lobby join
      socket.on('lobby:join', (code) => {
        const player = this.playerSockets[socket.id];
        if (!player) {
          socket.emit('error', { message: 'Player not set up' });
          return;
        }

        const lobby = this.privateLobby[code];
        if (!lobby) {
          socket.emit('error', { message: 'Lobby not found' });
          return;
        }

        if (lobby.guest) {
          socket.emit('error', { message: 'Lobby is full' });
          return;
        }

        lobby.guest = socket.id;
        socket.join(`lobby-${code}`);

        const hostPlayer = this.playerSockets[lobby.host];
        const guestPlayer = this.playerSockets[socket.id];

        // Notify both players
        this.io.to(`lobby-${code}`).emit('lobby:updated', {
          code,
          host: {
            username: hostPlayer.username,
            avatar: hostPlayer.avatar,
            ready: true
          },
          guest: {
            username: guestPlayer.username,
            avatar: guestPlayer.avatar,
            ready: true
          }
        });

        console.log(`${player.username} joined lobby ${code}`);

        // Start game after short delay
        setTimeout(() => {
          this.startPrivateGame(code);
        }, 2000);
      });

      // Handle game moves
      socket.on('game:move', (data) => {
        const { gameId, move, fen, timeLeft } = data;
        const game = this.activeGames[gameId];
        
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        // Validate it's the player's turn
        const player = this.playerSockets[socket.id];
        const isWhiteTurn = fen.includes(' w ');
        const isPlayerWhite = game.white === socket.id;

        if ((isWhiteTurn && !isPlayerWhite) || (!isWhiteTurn && isPlayerWhite)) {
          socket.emit('error', { message: 'Not your turn' });
          return;
        }

        // Update game state
        game.fen = fen;
        game.lastMove = move;
        game.moveHistory.push(move);

        // Update time
        if (isPlayerWhite) {
          game.whiteTime = timeLeft.white;
          game.blackTime = timeLeft.black;
        } else {
          game.whiteTime = timeLeft.white;
          game.blackTime = timeLeft.black;
        }

        // Broadcast move to opponent
        const opponentId = isPlayerWhite ? game.black : game.white;
        this.io.to(opponentId).emit('game:move', {
          move,
          fen,
          timeLeft: {
            white: game.whiteTime,
            black: game.blackTime
          }
        });

        console.log(`Move in game ${gameId}: ${move}`);
      });

      // Handle chat messages
      socket.on('chat:message', (data) => {
        const { gameId, message } = data;
        const game = this.activeGames[gameId];
        
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        const player = this.playerSockets[socket.id];
        const isWhite = game.white === socket.id;
        const opponentId = isWhite ? game.black : game.white;

        // Send to opponent
        this.io.to(opponentId).emit('chat:message', {
          username: player.username,
          message,
          timestamp: Date.now()
        });

        console.log(`Chat in game ${gameId} from ${player.username}: ${message}`);
      });

      // Handle game over
      socket.on('game:over', (data) => {
        const { gameId, result } = data;
        const game = this.activeGames[gameId];
        
        if (!game) return;

        // Notify both players
        this.io.to(game.white).emit('game:over', result);
        this.io.to(game.black).emit('game:over', result);

        // Clean up game
        delete this.activeGames[gameId];
        console.log(`Game ${gameId} ended: ${result.winner}`);
      });

      // Handle player resign
      socket.on('game:resign', (gameId) => {
        const game = this.activeGames[gameId];
        if (!game) return;

        const player = this.playerSockets[socket.id];
        const isWhite = game.white === socket.id;
        const opponentId = isWhite ? game.black : game.white;

        this.io.to(opponentId).emit('game:opponent_resigned', {
          winner: isWhite ? 'black' : 'white'
        });

        delete this.activeGames[gameId];
        console.log(`Player ${player.username} resigned from game ${gameId}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        
        // Remove from matchmaking queue
        const queueIndex = this.waitingPlayers.indexOf(socket.id);
        if (queueIndex > -1) {
          this.waitingPlayers.splice(queueIndex, 1);
        }

        // Handle active game disconnect
        for (const [gameId, game] of Object.entries(this.activeGames)) {
          if (game.white === socket.id || game.black === socket.id) {
            const opponentId = game.white === socket.id ? game.black : game.white;
            this.io.to(opponentId).emit('game:opponent_disconnected');
            
            // Keep game for 60 seconds for reconnection
            setTimeout(() => {
              if (this.activeGames[gameId]) {
                delete this.activeGames[gameId];
              }
            }, 60000);
          }
        }

        // Handle private lobby
        for (const [code, lobby] of Object.entries(this.privateLobby)) {
          if (lobby.host === socket.id || lobby.guest === socket.id) {
            this.io.to(`lobby-${code}`).emit('lobby:closed');
            delete this.privateLobby[code];
          }
        }

        // Clean up player data
        delete this.playerSockets[socket.id];
      });
    });
  }

  tryMatchPlayers() {
    while (this.waitingPlayers.length >= 2) {
      const player1Id = this.waitingPlayers.shift();
      const player2Id = this.waitingPlayers.shift();

      const player1 = this.playerSockets[player1Id];
      const player2 = this.playerSockets[player2Id];

      if (!player1 || !player2) continue;

      // Create game
      const gameId = uuidv4();
      
      // Randomly assign colors
      const [whiteId, blackId] = Math.random() > 0.5 
        ? [player1Id, player2Id] 
        : [player2Id, player1Id];

      this.activeGames[gameId] = {
        id: gameId,
        white: whiteId,
        black: blackId,
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        moveHistory: [],
        whiteTime: 180, // Default to blitz
        blackTime: 180,
        timeControl: 'blitz',
        createdAt: Date.now()
      };

      // Notify players
      const whitePlayer = this.playerSockets[whiteId];
      const blackPlayer = this.playerSockets[blackId];

      this.io.to(whiteId).emit('game:start', {
        gameId,
        color: 'white',
        opponent: {
          username: blackPlayer.username,
          avatar: blackPlayer.avatar
        },
        timeControl: 'blitz'
      });

      this.io.to(blackId).emit('game:start', {
        gameId,
        color: 'black',
        opponent: {
          username: whitePlayer.username,
          avatar: whitePlayer.avatar
        },
        timeControl: 'blitz'
      });

      console.log(`Game started: ${gameId} - ${whitePlayer.username} (white) vs ${blackPlayer.username} (black)`);
    }
  }

  startPrivateGame(code) {
    const lobby = this.privateLobby[code];
    if (!lobby || !lobby.guest) return;

    const gameId = uuidv4();
    const hostPlayer = this.playerSockets[lobby.host];
    const guestPlayer = this.playerSockets[lobby.guest];

    // Host is always white in private games
    this.activeGames[gameId] = {
      id: gameId,
      white: lobby.host,
      black: lobby.guest,
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      moveHistory: [],
      whiteTime: lobby.gameConfig.timeControl === 'rapid' ? 600 : 
                 lobby.gameConfig.timeControl === 'blitz' ? 180 : 
                 lobby.gameConfig.timeControl === 'bullet' ? 60 : 0,
      blackTime: lobby.gameConfig.timeControl === 'rapid' ? 600 : 
                 lobby.gameConfig.timeControl === 'blitz' ? 180 : 
                 lobby.gameConfig.timeControl === 'bullet' ? 60 : 0,
      timeControl: lobby.gameConfig.timeControl,
      createdAt: Date.now()
    };

    // Notify players
    this.io.to(lobby.host).emit('game:start', {
      gameId,
      color: 'white',
      opponent: {
        username: guestPlayer.username,
        avatar: guestPlayer.avatar
      },
      timeControl: lobby.gameConfig.timeControl
    });

    this.io.to(lobby.guest).emit('game:start', {
      gameId,
      color: 'black',
      opponent: {
        username: hostPlayer.username,
        avatar: hostPlayer.avatar
      },
      timeControl: lobby.gameConfig.timeControl
    });

    // Clean up lobby
    delete this.privateLobby[code];
    console.log(`Private game started: ${gameId} from lobby ${code}`);
  }

  generateLobbyCode() {
    let code;
    do {
      code = Math.floor(10000 + Math.random() * 90000).toString();
    } while (this.privateLobby[code]);
    return code;
  }
}

module.exports = GameServer;
