import { useState, useEffect } from 'react'
import { AVATARS } from '../types'
import wsClient from '../utils/websocket'
import './OnlineSetupScreen.css'

interface OnlineSetupScreenProps {
  onSetupComplete: (username: string, avatar: string) => void
  onBack: () => void
}

function OnlineSetupScreen({ onSetupComplete, onBack }: OnlineSetupScreenProps) {
  const [username, setUsername] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Load saved username
    const saved = localStorage.getItem('online_username')
    if (saved) {
      setUsername(saved)
    }

    // Load saved avatar
    const savedAvatar = localStorage.getItem('online_avatar')
    if (savedAvatar && AVATARS.includes(savedAvatar)) {
      setSelectedAvatar(savedAvatar)
    }
  }, [])

  const handleContinue = async () => {
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters')
      return
    }

    if (username.trim().length > 20) {
      setError('Username must be less than 20 characters')
      return
    }

    setConnecting(true)
    setError('')

    try {
      // Connect to WebSocket server
      await wsClient.connect()
      
      // Setup player
      wsClient.setupPlayer(username.trim(), selectedAvatar)
      
      // Save to localStorage
      localStorage.setItem('online_username', username.trim())
      localStorage.setItem('online_avatar', selectedAvatar)
      
      onSetupComplete(username.trim(), selectedAvatar)
    } catch (err) {
      console.error('Failed to connect:', err)
      setError('Failed to connect to server. Please try again.')
      setConnecting(false)
    }
  }

  return (
    <div className="online-setup-screen">
      <div className="online-setup-container">
        <h1 className="online-setup-title">Online Play Setup</h1>
        
        <div className="setup-section">
          <label className="setup-label">Choose your username:</label>
          <input
            type="text"
            className="username-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username..."
            maxLength={20}
            disabled={connecting}
          />
        </div>

        <div className="setup-section">
          <label className="setup-label">Choose your avatar:</label>
          <div className="avatar-grid">
            {AVATARS.map((avatar) => (
              <button
                key={avatar}
                className={`avatar-button ${selectedAvatar === avatar ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(avatar)}
                disabled={connecting}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={connecting || !username.trim()}
        >
          {connecting ? 'Connecting...' : '✓ Continue'}
        </button>

        <button
          className="back-button"
          onClick={onBack}
          disabled={connecting}
        >
          ← Back
        </button>
      </div>
    </div>
  )
}

export default OnlineSetupScreen
