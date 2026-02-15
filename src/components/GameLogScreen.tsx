import { useEffect, useState } from 'react'
import { getGameLogs, formatGameLog, clearGameLogs } from '../utils/gameStorage'
import { GameLog } from '../types'
import './GameLogScreen.css'

interface GameLogScreenProps {
  onBack: () => void
}

function GameLogScreen({ onBack }: GameLogScreenProps) {
  const [logs, setLogs] = useState<GameLog[]>([])

  useEffect(() => {
    setLogs(getGameLogs())
  }, [])

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all game history?')) {
      clearGameLogs()
      setLogs([])
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
    } else if (diffDays < 7) {
      return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'win': return '✅'
      case 'loss': return '❌'
      case 'draw': return '🤝'
      default: return '•'
    }
  }

  return (
    <div className="game-log-screen">
      <div className="game-log-container">
        <h1 className="game-log-title">Game History</h1>
        
        {logs.length === 0 ? (
          <div className="empty-log">
            <p>No games played yet!</p>
            <p>Start playing to track your game history.</p>
          </div>
        ) : (
          <>
            <div className="game-log-list">
              {logs.map((log) => (
                <div key={log.id} className={`game-log-item ${log.result}`}>
                  <div className="log-icon">{getResultIcon(log.result)}</div>
                  <div className="log-content">
                    <div className="log-summary">{formatGameLog(log)}</div>
                    <div className="log-details">
                      <span className="log-color">
                        {log.playerColor === 'white' ? '⚪ White' : '⚫ Black'}
                      </span>
                      <span className="log-separator">•</span>
                      <span className="log-moves">{log.moveCount} moves</span>
                      <span className="log-separator">•</span>
                      <span className="log-date">{formatDate(log.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="clear-log-button" onClick={handleClearLogs}>
              🗑️ Clear History
            </button>
          </>
        )}

        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>
      </div>
    </div>
  )
}

export default GameLogScreen
