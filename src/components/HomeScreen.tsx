import { useState, useEffect } from 'react'
import './HomeScreen.css'

interface HomeScreenProps {
  onPlay: () => void
}

function HomeScreen({ onPlay }: HomeScreenProps) {
  const [sfxEnabled, setSfxEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sfxEnabled')
    if (saved !== null) {
      setSfxEnabled(saved === 'true')
    }
  }, [])

  const toggleSfx = () => {
    const newValue = !sfxEnabled
    setSfxEnabled(newValue)
    localStorage.setItem('sfxEnabled', String(newValue))
  }

  return (
    <div className="home-screen">
      <div className="home-container">
        <h1 className="title">Welcome to Chess Online</h1>
        
        <button className="play-button" onClick={onPlay}>
          Play
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
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeScreen
