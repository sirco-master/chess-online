import { useState, useEffect } from 'react'
import { getSetting, setSetting } from '../utils/gameStorage'
import './WelcomeScreen.css'

interface WelcomeScreenProps {
  onPlay: () => void
}

function WelcomeScreen({ onPlay }: WelcomeScreenProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [sfxEnabled, setSfxEnabled] = useState(true)
  const [clickToMove, setClickToMove] = useState(true)
  const [showMoveGrid, setShowMoveGrid] = useState(true)
  const [dmEnabled, setDmEnabled] = useState(true)

  useEffect(() => {
    setSfxEnabled(getSetting('sfxEnabled', true))
    setClickToMove(getSetting('clickToMove', true))
    setShowMoveGrid(getSetting('showMoveGrid', true))
    setDmEnabled(getSetting('dmEnabled', true))
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

  const toggleDmEnabled = () => {
    const newValue = !dmEnabled
    setDmEnabled(newValue)
    setSetting('dmEnabled', newValue)
  }

  return (
    <div className="welcome-screen">
      {/* Logo in top left */}
      <div className="app-logo-welcome">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
          <rect width="60" height="60" rx="12" fill="url(#logoGradient)"/>
          <text x="30" y="42" fontSize="32" fill="white" textAnchor="middle" fontWeight="bold">♔</text>
        </svg>
        <span className="logo-text">rz-play</span>
      </div>
      
      {/* Settings gear in top right */}
      <button className="settings-gear" onClick={() => setShowSettings(!showSettings)} aria-label="Settings">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74486 20.1656 6.23582 20.3766 5.705 20.3766C5.17418 20.3766 4.66514 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95235 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76733 10.0642 4.36613 9.63587 4.6 9C4.87235 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74486 3.62343 6.23582 3.62343 5.705C3.62343 5.17418 3.83445 4.66514 4.21 4.29C4.58514 3.91445 5.09418 3.70343 5.625 3.70343C6.15582 3.70343 6.66486 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95235 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87235 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58514 20.2966 5.09418 20.2966 5.625C20.2966 6.15582 20.0856 6.66486 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h2>⚙️ Settings</h2>
            <div className="settings-list">
              <div className="setting-item">
                <label>
                  <input type="checkbox" checked={sfxEnabled} onChange={toggleSfx} />
                  <span>Sound Effects</span>
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" checked={clickToMove} onChange={toggleClickToMove} />
                  <span>Click-to-Move</span>
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" checked={showMoveGrid} onChange={toggleShowMoveGrid} />
                  <span>Show Move Hints</span>
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input type="checkbox" checked={dmEnabled} onChange={toggleDmEnabled} />
                  <span>Allow DMs from New Users</span>
                </label>
              </div>
            </div>
            <button className="close-settings-button" onClick={() => setShowSettings(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Centered content */}
      <div className="welcome-container">
        <h1 className="welcome-title">Welcome to Chess World</h1>
        <p className="welcome-subtitle">Master the game, connect with players worldwide</p>
        
        <button className="play-button-large" onClick={onPlay}>
          <span className="play-icon">▶</span>
          <span>Play</span>
        </button>
      </div>
    </div>
  )
}

export default WelcomeScreen
