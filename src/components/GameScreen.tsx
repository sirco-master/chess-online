import { useState, useEffect, useCallback } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import { GameMode, Difficulty } from '../App'
import StockfishEngine, { difficultyConfigs } from '../utils/stockfish'
import './GameScreen.css'

interface GameScreenProps {
  mode: GameMode
  difficulty: Difficulty
  onBack: () => void
}

function GameScreen({ mode, difficulty, onBack }: GameScreenProps) {
  const [game, setGame] = useState(new Chess())
  const [stockfish] = useState(() => new StockfishEngine())
  const [hintsRemaining, setHintsRemaining] = useState(3)
  const [undoRemaining, setUndoRemaining] = useState(5)
  const [isThinking, setIsThinking] = useState(false)
  const [gameStatus, setGameStatus] = useState<string>('')
  const [hintMove, setHintMove] = useState<string>('')
  const [sfxEnabled, setSfxEnabled] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('sfxEnabled')
    if (saved !== null) {
      setSfxEnabled(saved === 'true')
    }
  }, [])

  useEffect(() => {
    if (mode === 'single-player') {
      stockfish.init().catch((error) => {
        console.error('Failed to initialize Stockfish:', error)
        setGameStatus('Error: Could not load chess engine')
      })
    }

    return () => {
      stockfish.terminate()
    }
  }, [mode, stockfish])

  const playMoveSound = () => {
    if (sfxEnabled) {
      const audio = new Audio('/move.mp3')
      audio.volume = 0.3
      audio.play().catch(() => {})
    }
  }

  const updateGameStatus = useCallback((chess: Chess) => {
    if (chess.isGameOver()) {
      if (chess.isCheckmate()) {
        const winner = chess.turn() === 'w' ? 'Black' : 'White'
        setGameStatus(`Checkmate! ${winner} wins!`)
      } else if (chess.isDraw()) {
        setGameStatus('Game drawn')
      } else if (chess.isStalemate()) {
        setGameStatus('Stalemate')
      } else if (chess.isThreefoldRepetition()) {
        setGameStatus('Draw by repetition')
      } else if (chess.isInsufficientMaterial()) {
        setGameStatus('Draw by insufficient material')
      }
    } else if (chess.inCheck()) {
      setGameStatus('Check!')
    } else {
      const turn = chess.turn() === 'w' ? 'White' : 'Black'
      setGameStatus(`${turn} to move`)
    }
  }, [])

  const makeBotMove = useCallback(async (chess: Chess) => {
    if (chess.isGameOver()) return

    setIsThinking(true)
    try {
      const config = difficultyConfigs[difficulty]
      const bestMove = await stockfish.getBestMove(chess.fen(), config)
      
      const from = bestMove.substring(0, 2)
      const to = bestMove.substring(2, 4)
      const promotion = bestMove.length > 4 ? bestMove[4] : undefined

      const move = chess.move({ from, to, promotion })
      
      if (move) {
        playMoveSound()
        setGame(new Chess(chess.fen()))
        updateGameStatus(chess)
      }
    } catch (error) {
      console.error('Bot move error:', error)
      setGameStatus('Error: Bot failed to move')
    } finally {
      setIsThinking(false)
    }
  }, [difficulty, stockfish, updateGameStatus])

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (isThinking) return false
    if (mode === 'single-player' && game.turn() === 'b') return false

    const gameCopy = new Chess(game.fen())
    
    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      })

      if (move) {
        playMoveSound()
        setGame(new Chess(gameCopy.fen()))
        updateGameStatus(gameCopy)
        setHintMove('')

        if (mode === 'single-player' && !gameCopy.isGameOver()) {
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
    if (undoRemaining <= 0 || mode === '2-player') return
    
    const gameCopy = new Chess(game.fen())
    
    if (mode === 'single-player') {
      gameCopy.undo()
      gameCopy.undo()
    } else {
      gameCopy.undo()
    }
    
    setGame(new Chess(gameCopy.fen()))
    updateGameStatus(gameCopy)
    setUndoRemaining(undoRemaining - 1)
    setHintMove('')
  }

  const handleHint = async () => {
    if (hintsRemaining <= 0 || mode === '2-player' || isThinking) return
    
    setIsThinking(true)
    try {
      const config = difficultyConfigs[difficulty]
      const bestMove = await stockfish.getBestMove(game.fen(), { ...config, skill: 20, depth: 15 })
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
    updateGameStatus(newGame)
  }

  useEffect(() => {
    updateGameStatus(game)
  }, [game, updateGameStatus])

  const customSquareStyles = hintMove ? {
    [hintMove.substring(0, 2)]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
    [hintMove.substring(2, 4)]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
  } : {}

  return (
    <div className="game-screen">
      <div className="game-container">
        <div className="game-header">
          <h2 className="game-title">
            {mode === 'single-player' 
              ? `Playing vs ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Bot` 
              : '2 Player Mode'}
          </h2>
          <div className="game-status">{gameStatus}</div>
        </div>

        <div className="board-wrapper">
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            customSquareStyles={customSquareStyles}
            boardWidth={Math.min(600, window.innerWidth - 40)}
          />
        </div>

        <div className="game-controls">
          {mode === 'single-player' && (
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
            className="control-button back-button"
            onClick={onBack}
          >
            ← Back to Menu
          </button>
        </div>

        {isThinking && (
          <div className="thinking-indicator">
            Bot is thinking...
          </div>
        )}
      </div>
    </div>
  )
}

export default GameScreen
