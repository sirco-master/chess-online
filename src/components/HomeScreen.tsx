import { useState, useEffect } from 'react'
import { getSetting, setSetting } from '../utils/gameStorage'
import './HomeScreen.css'

interface HomeScreenProps {
  onPlay: () => void
  onViewGameLog: () => void
  onViewProfile: () => void
}

function HomeScreen({ onPlay, onViewGameLog, onViewProfile }: HomeScreenProps) {
  const [sfxEnabled, setSfxEnabled] = useState(true)
  const [clickToMove, setClickToMove] = useState(true)
  const [showMoveGrid, setShowMoveGrid] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setSfxEnabled(getSetting('sfxEnabled', true))
    setClickToMove(getSetting('clickToMove', true))
    setShowMoveGrid(getSetting('showMoveGrid', true))
  }, [])

  const toggleSfx = () => {
    const newValue = !sfxEnabled
    setSfxEnabled(newValue)
    setSetting('sfxEnabled', newValue)
  }

  const toggleClickToMove = () => {
    const newValue = !clickToMove
    setClickToMove(newValue)
    setSetting('clickToMove', newValue)
  }

  const toggleShowMoveGrid = () => {
    const newValue = !showMoveGrid
    setShowMoveGrid(newValue)
    setSetting('showMoveGrid', newValue)
  }

  return (
    <div className="home-screen">
      {/* Logo in top left */}
      <div className="app-logo">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#2C3E50"/>
          <text x="20" y="28" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">CW</text>
        </svg>
      </div>
      
      <div className="home-container">
        <h1 className="title">Welcome to Chess World</h1>
        
        <button className="play-button" onClick={onPlay}>
          Play
        </button>

        <button className="game-log-button" onClick={onViewGameLog}>
          📊 Game History
        </button>

        <button className="profile-button" onClick={onViewProfile}>
          👤 Profile
        </button>

        <button className="settings-button" onClick={() => setShowSettings(!showSettings)}>
          ⚙️ Settings
        </button>

        {showSettings && (
          <div className="settings-menu">
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={sfxEnabled}
                  onChange={toggleSfx}
                />
                <span>Sound Effects</span>
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={clickToMove}
                  onChange={toggleClickToMove}
                />
                <span>Click-to-Move (alternative to drag)</span>
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={showMoveGrid}
                  onChange={toggleShowMoveGrid}
                />
                <span>Show Move Hints (green dots)</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeScreen
