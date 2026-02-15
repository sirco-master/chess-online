import { io, Socket } from 'socket.io-client';

class WebSocketClient {
  private socket: Socket | null = null;
  private connected: boolean = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Connect to the same server (works in dev and production)
      const url = window.location.origin;
      
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected:', this.socket?.id);
        this.connected = true;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        this.connected = false;
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  setupPlayer(username: string, avatar: string): void {
    if (!this.socket) return;
    this.socket.emit('player:setup', { username, avatar });
  }

  // Matchmaking
  joinMatchmaking(): void {
    if (!this.socket) return;
    this.socket.emit('matchmaking:join');
  }

  leaveMatchmaking(): void {
    if (!this.socket) return;
    this.socket.emit('matchmaking:leave');
  }

  onMatchmakingSearching(callback: () => void): void {
    if (!this.socket) return;
    this.socket.on('matchmaking:searching', callback);
  }

  // Private lobby
  createLobby(gameConfig: any): void {
    if (!this.socket) return;
    this.socket.emit('lobby:create', gameConfig);
  }

  joinLobby(code: string): void {
    if (!this.socket) return;
    this.socket.emit('lobby:join', code);
  }

  onLobbyCreated(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('lobby:created', callback);
  }

  onLobbyUpdated(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('lobby:updated', callback);
  }

  onLobbyClosed(callback: () => void): void {
    if (!this.socket) return;
    this.socket.on('lobby:closed', callback);
  }

  // Game events
  onGameStart(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('game:start', callback);
  }

  sendMove(gameId: string, move: string, fen: string, timeLeft: { white: number; black: number }): void {
    if (!this.socket) return;
    this.socket.emit('game:move', { gameId, move, fen, timeLeft });
  }

  onMove(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('game:move', callback);
  }

  sendGameOver(gameId: string, result: any): void {
    if (!this.socket) return;
    this.socket.emit('game:over', { gameId, result });
  }

  onGameOver(callback: (result: any) => void): void {
    if (!this.socket) return;
    this.socket.on('game:over', callback);
  }

  resignGame(gameId: string): void {
    if (!this.socket) return;
    this.socket.emit('game:resign', gameId);
  }

  onOpponentResigned(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('game:opponent_resigned', callback);
  }

  onOpponentDisconnected(callback: () => void): void {
    if (!this.socket) return;
    this.socket.on('game:opponent_disconnected', callback);
  }

  // Chat
  sendChatMessage(gameId: string, message: string): void {
    if (!this.socket) return;
    this.socket.emit('chat:message', { gameId, message });
  }

  onChatMessage(callback: (data: any) => void): void {
    if (!this.socket) return;
    this.socket.on('chat:message', callback);
  }

  // Error handling
  onError(callback: (error: any) => void): void {
    if (!this.socket) return;
    this.socket.on('error', callback);
  }

  isConnected(): boolean {
    return this.connected;
  }

  removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

// Singleton instance
const wsClient = new WebSocketClient();
export default wsClient;
