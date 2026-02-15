import { useState, useEffect } from 'react'
import { TimeControlType } from '../types'
import wsClient from '../utils/websocket'
import './OnlineLobbyScreen.css'

interface OnlineLobbyScreenProps {
  username: string
  avatar: string
  onGameStart: (gameData: any) => void
  onBack: () => void
}

type LobbyMode = 'select' | 'public-searching' | 'private-create' | 'private-join' | 'private-waiting'

function OnlineLobbyScreen({ username, avatar, onGameStart, onBack }: OnlineLobbyScreenProps) {
  const [mode, setMode] = useState<LobbyMode>('select')
  const [lobbyCode, setLobbyCode] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [lobbyData, setLobbyData] = useState<any>(null)
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControlType>('blitz')
  const [error, setError] = useState('')

  useEffect(() => {
    // Setup WebSocket listeners
    wsClient.onMatchmakingSearching(() => {
      console.log('Searching for match...')
    })

    wsClient.onGameStart((data) => {
      console.log('Game starting:', data)
      onGameStart(data)
    })

    wsClient.onLobbyCreated((data) => {
      console.log('Lobby created:', data)
      setLobbyCode(data.code)
      setLobbyData(data)
      setMode('private-waiting')
    })

    wsClient.onLobbyUpdated((data) => {
      console.log('Lobby updated:', data)
      setLobbyData(data)
    })

    wsClient.onLobbyClosed(() => {
      console.log('Lobby closed')
      setError('Lobby was closed by the host')
      setMode('select')
    })

    wsClient.onError((err) => {
      console.error('WebSocket error:', err)
      setError(err.message || 'An error occurred')
    })

    return () => {
      // Cleanup
      if (mode === 'public-searching') {
        wsClient.leaveMatchmaking()
      }
    }
  }, [onGameStart])

  const handlePublicMatch = () => {
    setMode('public-searching')
    setError('')
    wsClient.joinMatchmaking()
  }

  const handleCancelPublic = () => {
    wsClient.leaveMatchmaking()
    setMode('select')
  }

  const handleCreatePrivate = () => {
    setMode('private-create')
    setError('')
  }

  const handleConfirmCreate = () => {
    wsClient.createLobby({
      timeControl: selectedTimeControl
    })
  }

  const handleJoinPrivate = () => {
    setMode('private-join')
    setError('')
    setCodeInput('')
  }

  const handleConfirmJoin = () => {
    if (codeInput.length !== 5) {
      setError('Lobby code must be 5 digits')
      return
    }
    
    setError('')
    wsClient.joinLobby(codeInput)
  }

  const handleBackToSelect = () => {
    if (mode === 'public-searching') {
      wsClient.leaveMatchmaking()
    }
    setMode('select')
    setError('')
  }

  return (
    <div className="online-lobby-screen">
      <div className="online-lobby-container">
        {mode === 'select' && (
          <>
            <h1 className="lobby-title">Choose Online Mode</h1>
            
            <div className="lobby-modes">
              <button className="lobby-mode-button public" onClick={handlePublicMatch}>
                <div className="mode-icon">🌐</div>
                <div className="mode-name">Public Match</div>
                <div className="mode-desc">Quick matchmaking with random opponent</div>
              </button>

              <button className="lobby-mode-button private" onClick={handleCreatePrivate}>
                <div className="mode-icon">🔒</div>
                <div className="mode-name">Create Private Lobby</div>
                <div className="mode-desc">Generate code to share with friend</div>
              </button>

              <button className="lobby-mode-button join" onClick={handleJoinPrivate}>
                <div className="mode-icon">🔑</div>
                <div className="mode-name">Join Private Lobby</div>
                <div className="mode-desc">Enter code to join friend's game</div>
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button className="back-button" onClick={onBack}>
              ← Back
            </button>
          </>
        )}

        {mode === 'public-searching' && (
          <>
            <h1 className="lobby-title">Finding Opponent...</h1>
            
            <div className="searching-animation">
              <div className="spinner"></div>
              <p className="searching-text">Looking for a match...</p>
              <p className="searching-subtext">This may take a moment</p>
            </div>

            <div className="player-info">
              <div className="player-card">
                <div className="player-avatar">{avatar}</div>
                <div className="player-name">{username}</div>
              </div>
            </div>

            <button className="cancel-button" onClick={handleCancelPublic}>
              Cancel
            </button>
          </>
        )}

        {mode === 'private-create' && (
          <>
            <h1 className="lobby-title">Create Private Lobby</h1>
            
            <div className="time-control-section">
              <label className="section-label">Select Time Control:</label>
              <div className="time-control-options">
                <button
                  className={`tc-option ${selectedTimeControl === 'normal' ? 'selected' : ''}`}
                  onClick={() => setSelectedTimeControl('normal')}
                >
                  Normal
                </button>
                <button
                  className={`tc-option ${selectedTimeControl === 'rapid' ? 'selected' : ''}`}
                  onClick={() => setSelectedTimeControl('rapid')}
                >
                  Rapid (10+5)
                </button>
                <button
                  className={`tc-option ${selectedTimeControl === 'blitz' ? 'selected' : ''}`}
                  onClick={() => setSelectedTimeControl('blitz')}
                >
                  Blitz (3+2)
                </button>
                <button
                  className={`tc-option ${selectedTimeControl === 'bullet' ? 'selected' : ''}`}
                  onClick={() => setSelectedTimeControl('bullet')}
                >
                  Bullet (1+1)
                </button>
              </div>
            </div>

            <button className="create-lobby-button" onClick={handleConfirmCreate}>
              Create Lobby
            </button>

            <button className="back-button" onClick={handleBackToSelect}>
              ← Back
            </button>
          </>
        )}

        {mode === 'private-waiting' && (
          <>
            <h1 className="lobby-title">Private Lobby</h1>
            
            <div className="lobby-code-display">
              <div className="code-label">Share this code:</div>
              <div className="lobby-code">{lobbyCode}</div>
              <div className="code-hint">Your friend can join with this code</div>
            </div>

            <div className="lobby-players">
              <div className="lobby-player">
                <div className="lobby-player-avatar">{lobbyData?.host?.avatar}</div>
                <div className="lobby-player-name">{lobbyData?.host?.username}</div>
                <div className="lobby-player-status">Host (You)</div>
              </div>
              
              {lobbyData?.guest ? (
                <div className="lobby-player">
                  <div className="lobby-player-avatar">{lobbyData.guest.avatar}</div>
                  <div className="lobby-player-name">{lobbyData.guest.username}</div>
                  <div className="lobby-player-status">Guest</div>
                </div>
              ) : (
                <div className="lobby-player waiting">
                  <div className="lobby-player-avatar">❓</div>
                  <div className="lobby-player-name">Waiting for player...</div>
                </div>
              )}
            </div>

            <button className="back-button" onClick={handleBackToSelect}>
              Cancel Lobby
            </button>
          </>
        )}

        {mode === 'private-join' && (
          <>
            <h1 className="lobby-title">Join Private Lobby</h1>
            
            <div className="code-input-section">
              <label className="section-label">Enter 5-digit lobby code:</label>
              <input
                type="text"
                className="code-input"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="12345"
                maxLength={5}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              className="join-lobby-button"
              onClick={handleConfirmJoin}
              disabled={codeInput.length !== 5}
            >
              Join Lobby
            </button>

            <button className="back-button" onClick={handleBackToSelect}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default OnlineLobbyScreen
