import { useState, useEffect, useCallback, useRef } from 'react'
import { Chess, Square } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { GameConfig } from '../App'
import StockfishEngine, { difficultyConfigs } from '../utils/stockfish'
import { addGameLog, getSetting, canUseAnalysis, markAnalysisUsed, getAnalysisCooldownRemaining, formatCooldownTime } from '../utils/gameStorage'
import { analyzeGame, getMoveQualityDisplay } from '../utils/analysis'
import { GameAnalysis, TIME_CONTROLS } from '../types'
import { useOnlineGame } from '../utils/useOnlineGame'
import ChatComponent from './ChatComponent'
import './GameScreen.css'

interface GameScreenProps {
  config: GameConfig
  onBack: () => void
  onViewGameLog: () => void
}

function GameScreen({ config, onBack, onViewGameLog }: GameScreenProps) {
  const [game, setGame] = useState(new Chess())
  const [stockfish] = useState(() => new StockfishEngine())
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [undoRemaining, setUndoRemaining] = useState(5)
  const [isThinking, setIsThinking] = useState(false)
  const [gameStatus, setGameStatus] = useState<string>('')
  const [hintMove, setHintMove] = useState<string>('')
  const [sfxEnabled, setSfxEnabled] = useState(true)
  const [clickToMove, setClickToMove] = useState(true)
  const [showMoveGrid, setShowMoveGrid] = useState(true)
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([])
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [gameResult, setGameResult] = useState<{ result: 'win' | 'loss' | 'draw'; message: string } | null>(null)
  const [whiteTime, setWhiteTime] = useState(TIME_CONTROLS[config.timeControl].timePerSide)
  const [blackTime, setBlackTime] = useState(TIME_CONTROLS[config.timeControl].timePerSide)
  const [isClockRunning, setIsClockRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const moveHistory = useRef<string[]>([])
  const [chatCollapsed, setChatCollapsed] = useState(false)

  // Online game state
  const isOnlineMode = config.mode === 'online-public' || config.mode === 'online-private'
  const onlineGame = isOnlineMode && config.gameId ? useOnlineGame({
    gameId: config.gameId,
    playerColor: config.playerColor,
    onOpponentMove: (move, fen, timeLeft) => {
      const gameCopy = new Chess(fen)
      moveHistory.current.push(move)
      playMoveSound()
      setGame(gameCopy)
      setWhiteTime(timeLeft.white)
      setBlackTime(timeLeft.black)
      updateGameStatus(gameCopy)
    },
    onOpponentResigned: () => {
      setGameStatus('Opponent resigned. You win!')
      setGameResult({
        result: 'win',
        message: 'Opponent resigned. You win!'
      })
      setShowGameOverModal(true)
      logGameResult('win')
    },
    onOpponentDisconnected: () => {
      setGameStatus('Opponent disconnected. Waiting to reconnect...')
    },
    onGameOver: (result) => {
      setGameResult(result)
      setShowGameOverModal(true)
    }
  }) : null

  // Load settings
  useEffect(() => {
    setSfxEnabled(getSetting('sfxEnabled', true))
    setClickToMove(getSetting('clickToMove', true))
    setShowMoveGrid(getSetting('showMoveGrid', true))
  }, [])

  // Initialize stockfish for single-player modes
  useEffect(() => {
    if (config.mode === 'single-player' || config.mode === 'personality-bot') {
      stockfish.init().catch((error) => {
        console.error('Failed to initialize Stockfish:', error)
        setGameStatus('Error: Could not load chess engine')
      })
    }

    return () => {
      stockfish.terminate()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [config.mode, stockfish])

  // Initialize board orientation based on player color
  useEffect(() => {
    if (config.playerColor === 'black' && (config.mode === 'single-player' || config.mode === 'personality-bot')) {
      // If player is black, bot makes first move
      const newGame = new Chess()
      setGame(newGame)
      setTimeout(() => makeBotMove(newGame), 500)
    }
  }, [])

  // Chess clock timer
  useEffect(() => {
    if (config.timeControl !== 'normal' && isClockRunning && !game.isGameOver()) {
      timerRef.current = setInterval(() => {
        const currentTurn = game.turn()
        if (currentTurn === 'w') {
          setWhiteTime((prev) => {
            if (prev <= 0) {
              handleTimeOut('white')
              return 0
            }
            return prev - 1
          })
        } else {
          setBlackTime((prev) => {
            if (prev <= 0) {
              handleTimeOut('black')
              return 0
            }
            return prev - 1
          })
        }
      }, 1000)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    }
  }, [isClockRunning, game])

  const handleTimeOut = (side: 'white' | 'black') => {
    setIsClockRunning(false)
    const winner = side === 'white' ? 'Black' : 'White'
    const playerWon = (side === 'white' && config.playerColor === 'black') || (side === 'black' && config.playerColor === 'white')
    
    setGameStatus(`${winner} wins on time!`)
    setGameResult({
      result: playerWon ? 'win' : 'loss',
      message: `${winner} wins on time!`
    })
    setShowGameOverModal(true)
    logGameResult(playerWon ? 'win' : 'loss')
  }

  const playMoveSound = () => {
    if (sfxEnabled) {
      const audio = new Audio('/move.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {})
    }
  }

  const updateGameStatus = useCallback((chess: Chess) => {
    if (chess.isGameOver()) {
      setIsClockRunning(false)
      if (chess.isCheckmate()) {
        const winner = chess.turn() === 'w' ? 'Black' : 'White'
        const playerWon = (winner === 'White' && config.playerColor === 'white') || (winner === 'Black' && config.playerColor === 'black')
        setGameStatus(`Checkmate! ${winner} wins!`)
        setGameResult({
          result: config.mode === '2-player' ? (chess.turn() === 'w' ? 'loss' : 'win') : (playerWon ? 'win' : 'loss'),
          message: `Checkmate! ${winner} wins!`
        })
        setShowGameOverModal(true)
        logGameResult(playerWon ? 'win' : 'loss')
      } else if (chess.isDraw()) {
        setGameStatus('Game drawn')
        setGameResult({ result: 'draw', message: 'Game drawn' })
        setShowGameOverModal(true)
        logGameResult('draw')
      } else if (chess.isStalemate()) {
        setGameStatus('Stalemate')
        setGameResult({ result: 'draw', message: 'Stalemate' })
        setShowGameOverModal(true)
        logGameResult('draw')
      } else if (chess.isThreefoldRepetition()) {
        setGameStatus('Draw by repetition')
        setGameResult({ result: 'draw', message: 'Draw by repetition' })
        setShowGameOverModal(true)
        logGameResult('draw')
      } else if (chess.isInsufficientMaterial()) {
        setGameStatus('Draw by insufficient material')
        setGameResult({ result: 'draw', message: 'Draw by insufficient material' })
        setShowGameOverModal(true)
        logGameResult('draw')
      }
    } else if (chess.inCheck()) {
      setGameStatus('Check!')
    } else {
      const turn = chess.turn() === 'w' ? 'White' : 'Black'
      setGameStatus(`${turn} to move`)
    }
  }, [config])

  const logGameResult = (result: 'win' | 'loss' | 'draw') => {
    const opponentName = config.personalityBot?.name || 
                        (config.difficulty ? config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1) + ' bot' : 'Opponent')
    
    addGameLog({
      opponent: opponentName,
      result,
      timeControl: config.timeControl,
      playerColor: config.playerColor,
      moveCount: Math.floor(game.history().length / 2)
    })
  }

  const makeBotMove = useCallback(async (chess: Chess) => {
    if (chess.isGameOver()) return

    setIsThinking(true)
    try {
      const difficulty = config.difficulty || 'beginner'
      const diffConfig = difficultyConfigs[difficulty]
      const bestMove = await stockfish.getBestMove(chess.fen(), diffConfig)
      
      const from = bestMove.substring(0, 2)
      const to = bestMove.substring(2, 4)
      const promotion = bestMove.length > 4 ? bestMove[4] : undefined

      const move = chess.move({ from, to, promotion })
      
      if (move) {
        moveHistory.current.push(move.san)
        playMoveSound()
        setGame(new Chess(chess.fen()))
        updateGameStatus(chess)
        
        // Add time increment
        if (config.timeControl !== 'normal') {
          const increment = TIME_CONTROLS[config.timeControl].increment
          if (chess.turn() === 'w') {
            setBlackTime(prev => prev + increment)
          } else {
            setWhiteTime(prev => prev + increment)
          }
          setIsClockRunning(true)
        }
      }
    } catch (error) {
      console.error('Bot move error:', error)
      setGameStatus('Error: Bot failed to move')
    } finally {
      setIsThinking(false)
    }
  }, [config, stockfish, updateGameStatus])

  const handleSquareClick = (square: Square) => {
    if (!clickToMove || isThinking || game.isGameOver()) return
    
    // For 2-player mode, allow both sides
    // For single-player and online, only allow player's color
    const isSinglePlayer = config.mode === 'single-player' || config.mode === 'personality-bot'
    if (isSinglePlayer || isOnlineMode) {
      const playerTurn = config.playerColor === 'white' ? 'w' : 'b'
      if (game.turn() !== playerTurn) return
    }

    if (selectedSquare) {
      // Try to make a move
      const gameCopy = new Chess(game.fen())
      try {
        const move = gameCopy.move({
          from: selectedSquare,
          to: square,
          promotion: 'q',
        })

        if (move) {
          moveHistory.current.push(move.san)
          playMoveSound()
          setGame(new Chess(gameCopy.fen()))
          updateGameStatus(gameCopy)
          setHintMove('')
          setSelectedSquare(null)
          setPossibleMoves([])

          // Add time increment
          if (config.timeControl !== 'normal') {
            const increment = TIME_CONTROLS[config.timeControl].increment
            if (gameCopy.turn() === 'w') {
              setBlackTime(prev => prev + increment)
            } else {
              setWhiteTime(prev => prev + increment)
            }
            if (!isClockRunning) setIsClockRunning(true)
          }

          // Handle different game modes
          if (isOnlineMode && onlineGame) {
            // Send move to opponent via WebSocket
            onlineGame.sendMove(move.san, gameCopy.fen(), {
              white: whiteTime,
              black: blackTime
            })
          } else if (isSinglePlayer && !gameCopy.isGameOver()) {
            setTimeout(() => makeBotMove(gameCopy), 500)
          }
        } else {
          // Invalid move, try selecting the new square
          selectSquare(square)
        }
      } catch {
        // Invalid move, try selecting the new square
        selectSquare(square)
      }
    } else {
      // Select a piece
      selectSquare(square)
    }
  }

  const selectSquare = (square: Square) => {
    const piece = game.get(square)
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square)
      const moves = game.moves({ square, verbose: true })
      setPossibleMoves(moves.map(m => m.to))
    } else {
      setSelectedSquare(null)
      setPossibleMoves([])
    }
  }

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (isThinking) return false
    
    const isSinglePlayer = config.mode === 'single-player' || config.mode === 'personality-bot'
    
    // Check if it's player's turn
    if (isSinglePlayer) {
      const playerTurn = config.playerColor === 'white' ? 'w' : 'b'
      if (game.turn() !== playerTurn) return false
    } else if (isOnlineMode) {
      // For online mode, check if it's player's turn
      const playerTurn = config.playerColor === 'white' ? 'w' : 'b'
      if (game.turn() !== playerTurn) return false
    }

    const gameCopy = new Chess(game.fen())
    
    try {
      const move = gameCopy.move({
        from: sourceSquare as Square,
        to: targetSquare as Square,
        promotion: 'q',
      })

      if (move) {
        moveHistory.current.push(move.san)
        playMoveSound()
        setGame(new Chess(gameCopy.fen()))
        updateGameStatus(gameCopy)
        setHintMove('')
        setSelectedSquare(null)
        setPossibleMoves([])

        // Add time increment
        if (config.timeControl !== 'normal') {
          const increment = TIME_CONTROLS[config.timeControl].increment
          if (gameCopy.turn() === 'w') {
            setBlackTime(prev => prev + increment)
          } else {
            setWhiteTime(prev => prev + increment)
          }
          if (!isClockRunning) setIsClockRunning(true)
        }

        // Handle different game modes
        if (isOnlineMode && onlineGame) {
          // Send move to opponent via WebSocket
          onlineGame.sendMove(move.san, gameCopy.fen(), {
            white: whiteTime,
            black: blackTime
          })
        } else if (isSinglePlayer && !gameCopy.isGameOver()) {
          setTimeout(() => makeBotMove(gameCopy), 500)
        }
        
        return true
      }
    } catch (error) {
      return false
    }

    return false
  }

  const handleUndo = () => {
    if (undoRemaining <= 0 || config.mode === '2-player') return
    
    const gameCopy = new Chess(game.fen())
    
    // Undo two moves (player + bot)
    if (gameCopy.history().length >= 2) {
      gameCopy.undo()
      gameCopy.undo()
      moveHistory.current = moveHistory.current.slice(0, -2)
    } else {
      return
    }
    
    setGame(new Chess(gameCopy.fen()))
    updateGameStatus(gameCopy)
    setUndoRemaining(undoRemaining - 1)
    setHintMove('')
    setSelectedSquare(null)
    setPossibleMoves([])
  }

  const handleHint = async () => {
    if (hintsRemaining <= 0 || config.mode === '2-player' || isThinking) return
    
    setIsThinking(true)
    try {
      const difficulty = config.difficulty || 'beginner'
      const diffConfig = difficultyConfigs[difficulty]
      const bestMove = await stockfish.getBestMove(game.fen(), { ...diffConfig, skill: 20, depth: 15 })
      setHintMove(bestMove)
      setHintsRemaining(hintsRemaining - 1)
    } catch (error) {
      console.error('Hint error:', error)
    } finally {
      setIsThinking(false)
    }
  }

  const handleNewGame = () => {
    const newGame = new Chess()
    setGame(newGame)
    setHintsRemaining(3)
    setUndoRemaining(5)
    setGameStatus('')
    setHintMove('')
    setIsThinking(false)
    setSelectedSquare(null)
    setPossibleMoves([])
    setShowGameOverModal(false)
    setGameResult(null)
    setAnalysis(null)
    setShowAnalysis(false)
    moveHistory.current = []
    
    // Reset clocks
    if (config.timeControl !== 'normal') {
      const time = TIME_CONTROLS[config.timeControl].timePerSide
      setWhiteTime(time)
      setBlackTime(time)
      setIsClockRunning(false)
    }
    
    updateGameStatus(newGame)

    // If player is black, make bot move first
    if (config.playerColor === 'black' && (config.mode === 'single-player' || config.mode === 'personality-bot')) {
      setTimeout(() => makeBotMove(newGame), 500)
    }
  }

  const handleAnalyzeGame = async () => {
    if (!canUseAnalysis()) {
      const remaining = getAnalysisCooldownRemaining()
      alert(`Analysis is available once per 24 hours. Please wait ${formatCooldownTime(remaining)}.`)
      return
    }

    if (moveHistory.current.length < 4) {
      alert('Play at least 4 moves to analyze the game.')
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    try {
      const gameAnalysis = await analyzeGame(
        stockfish,
        moveHistory.current,
        (progress) => setAnalysisProgress(progress)
      )
      
      setAnalysis(gameAnalysis)
      setShowAnalysis(true)
      markAnalysisUsed()
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze game. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    updateGameStatus(game)
  }, [game, updateGameStatus])

  const customSquareStyles: { [key: string]: React.CSSProperties } = {}
  
  if (hintMove) {
    customSquareStyles[hintMove.substring(0, 2)] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
    customSquareStyles[hintMove.substring(2, 4)] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
  }
  
  if (selectedSquare && clickToMove) {
    customSquareStyles[selectedSquare] = { backgroundColor: 'rgba(255, 255, 0, 0.6)' }
    
    if (showMoveGrid) {
      possibleMoves.forEach(square => {
        customSquareStyles[square] = { 
          background: 'radial-gradient(circle, rgba(0, 255, 0, 0.5) 25%, transparent 25%)',
          borderRadius: '50%'
        }
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getOpponentName = () => {
    if (isOnlineMode && config.opponentName) {
      return `${config.opponentAvatar || '👤'} ${config.opponentName}`
    } else if (config.personalityBot) {
      return `${config.personalityBot.avatar} ${config.personalityBot.name}`
    } else if (config.difficulty) {
      return `${config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1)} Bot`
    }
    return '2 Player Mode'
  }

  return (
    <div className="game-screen">
      <div className="game-container">
        <div className="game-header">
          <h2 className="game-title">{getOpponentName()}</h2>
          <div className="game-status">{gameStatus}</div>
        </div>

        {config.timeControl !== 'normal' && (
          <div className="chess-clocks">
            <div className={`chess-clock ${game.turn() === 'b' ? 'active' : ''}`}>
              <span className="clock-label">⚫ Black</span>
              <span className="clock-time">{formatTime(blackTime)}</span>
            </div>
            <div className={`chess-clock ${game.turn() === 'w' ? 'active' : ''}`}>
              <span className="clock-label">⚪ White</span>
              <span className="clock-time">{formatTime(whiteTime)}</span>
            </div>
          </div>
        )}

        <div className="board-and-chat-wrapper">
          <div className="board-wrapper">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              onSquareClick={handleSquareClick}
              customSquareStyles={customSquareStyles}
            boardOrientation={config.playerColor === 'black' ? 'black' : 'white'}
            boardWidth={Math.min(600, window.innerWidth - 40)}
          />
        </div>

        {isOnlineMode && onlineGame && (
          <div className="chat-wrapper">
            <ChatComponent
              messages={onlineGame.chatMessages}
              onSendMessage={onlineGame.sendChatMessage}
              collapsed={chatCollapsed}
              onToggle={() => setChatCollapsed(!chatCollapsed)}
            />
          </div>
        )}
      </div>

        <div className="game-controls">
          {(config.mode === 'single-player' || config.mode === 'personality-bot') && (
            <>
              <button 
                className="control-button hint-button"
                onClick={handleHint}
                disabled={hintsRemaining <= 0 || isThinking || game.isGameOver()}
              >
                💡 Hint ({hintsRemaining})
              </button>
              <button 
                className="control-button undo-button"
                onClick={handleUndo}
                disabled={undoRemaining <= 0 || game.history().length < 2 || isThinking || game.isGameOver()}
              >
                ↶ Undo ({undoRemaining})
              </button>
            </>
          )}
          <button 
            className="control-button new-game-button"
            onClick={handleNewGame}
          >
            🔄 New Game
          </button>
          <button 
            className="control-button game-log-button"
            onClick={onViewGameLog}
          >
            📊 History
          </button>
          <button 
            className="control-button back-button"
            onClick={onBack}
          >
            ← Back
          </button>
        </div>

        {game.isGameOver() && !showAnalysis && (
          <div className="post-game-actions">
            <button 
              className="analyze-button"
              onClick={handleAnalyzeGame}
              disabled={isAnalyzing || !canUseAnalysis()}
            >
              {isAnalyzing ? `Analyzing... ${analysisProgress}%` : '🔍 Analyze Game'}
            </button>
            {!canUseAnalysis() && (
              <p className="analysis-cooldown">
                Next analysis available in {formatCooldownTime(getAnalysisCooldownRemaining())}
              </p>
            )}
          </div>
        )}

        {isThinking && (
          <div className="thinking-indicator">
            Bot is thinking...
          </div>
        )}

        {showGameOverModal && gameResult && (
          <div className="modal-overlay" onClick={() => setShowGameOverModal(false)}>
            <div className="game-over-modal" onClick={(e) => e.stopPropagation()}>
              <div className={`modal-icon ${gameResult.result}`}>
                {gameResult.result === 'win' ? '🏆' : gameResult.result === 'loss' ? '😔' : '🤝'}
              </div>
              <h2 className="modal-title">{gameResult.message}</h2>
              <p className="modal-subtitle">
                {gameResult.result === 'win' ? 'Congratulations!' : 
                 gameResult.result === 'loss' ? 'Better luck next time!' : 
                 'Well played!'}
              </p>
              <div className="modal-actions">
                <button className="modal-button primary" onClick={() => { setShowGameOverModal(false); handleNewGame(); }}>
                  🔄 Play Again
                </button>
                <button className="modal-button" onClick={() => setShowGameOverModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showAnalysis && analysis && (
          <div className="modal-overlay" onClick={() => setShowAnalysis(false)}>
            <div className="analysis-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-title">Game Analysis</h2>
              
              <div className="accuracy-scores">
                <div className="accuracy-item">
                  <div className="accuracy-label">Your Accuracy</div>
                  <div className="accuracy-value">{analysis.playerAccuracy}%</div>
                </div>
                <div className="accuracy-item">
                  <div className="accuracy-label">Opponent Accuracy</div>
                  <div className="accuracy-value">{analysis.opponentAccuracy}%</div>
                </div>
              </div>

              <div className="moves-analysis">
                <h3>Move Quality</h3>
                <div className="moves-list">
                  {analysis.moves.map((moveAnalysis, index) => {
                    const display = getMoveQualityDisplay(moveAnalysis.quality)
                    return (
                      <div key={index} className="move-item">
                        <span className="move-number">{moveAnalysis.moveNumber}.</span>
                        <span className="move-notation">{moveAnalysis.move}</span>
                        <span className="move-quality" style={{ color: display.color }}>
                          {display.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="modal-actions">
                <button className="modal-button primary" onClick={() => setShowAnalysis(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameScreen
