import { useState, useEffect } from 'react'
import { getSetting, setSetting } from '../utils/gameStorage'
import './HomeScreen.css'

interface HomeScreenProps {
  onPlay: () => void
  onViewGameLog: () => void
}

function HomeScreen({ onPlay, onViewGameLog }: HomeScreenProps) {
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
      <div className="home-container">
        <h1 className="title">Welcome to Chess Online</h1>
        
        <button className="play-button" onClick={onPlay}>
          Play
        </button>

        <button className="game-log-button" onClick={onViewGameLog}>
          📊 Game History
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
