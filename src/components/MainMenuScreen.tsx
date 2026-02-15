import { getUserProfile } from '../utils/gameStorage'
import { getPendingFriendRequestCount, getUnreadNotificationCount } from '../utils/friendsStorage'
import { useState, useEffect } from 'react'
import './MainMenuScreen.css'

interface MainMenuScreenProps {
  onPlayOnline: () => void
  onPlayLocally: () => void
  onPlayBots: () => void
  onMatchHistory: () => void
  onProfile: () => void
  onChat: () => void
  onRZTV: () => void
  onClubs: () => void
  onBack: () => void
}

function MainMenuScreen({ 
  onPlayOnline, 
  onPlayLocally, 
  onPlayBots, 
  onMatchHistory, 
  onProfile,
  onChat,
  onRZTV,
  onClubs,
  onBack 
}: MainMenuScreenProps) {
  const [profile, setProfile] = useState(getUserProfile())
  const [friendRequestCount, setFriendRequestCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    // Update badge counts
    setFriendRequestCount(getPendingFriendRequestCount(profile.username))
    setNotificationCount(getUnreadNotificationCount(profile.username))
  }, [profile.username])

  return (
    <div className="main-menu-screen">
      {/* Header with user info */}
      <div className="main-menu-header">
        <div className="user-info-compact">
          <div className="user-avatar-small">{profile.avatar}</div>
          <div className="user-details-small">
            <div className="username-small">{profile.username}</div>
            <div className="user-elo-small">ELO: {profile.elo}</div>
          </div>
        </div>
        <button className="back-button-header" onClick={onBack}>
          ← Back
        </button>
      </div>

      {/* Main menu title */}
      <div className="main-menu-title-section">
        <h1 className="main-menu-title">Chess World</h1>
        <p className="main-menu-subtitle">Choose your adventure</p>
      </div>

      {/* Vertical menu items */}
      <div className="menu-items-container">
        <button className="menu-item" onClick={onPlayOnline}>
          <div className="menu-icon">🌐</div>
          <div className="menu-text">
            <div className="menu-label">Play Online</div>
            <div className="menu-description">Match with players worldwide</div>
          </div>
        </button>

        <button className="menu-item" onClick={onPlayLocally}>
          <div className="menu-icon">🏠</div>
          <div className="menu-text">
            <div className="menu-label">Play Locally</div>
            <div className="menu-description">Pass & play with a friend</div>
          </div>
        </button>

        <button className="menu-item" onClick={onPlayBots}>
          <div className="menu-icon">🤖</div>
          <div className="menu-text">
            <div className="menu-label">Play Bots</div>
            <div className="menu-description">Challenge AI opponents</div>
          </div>
        </button>

        <button className="menu-item" onClick={onClubs}>
          <div className="menu-icon">🏆</div>
          <div className="menu-text">
            <div className="menu-label">Clubs</div>
            <div className="menu-description">Join or create a chess club</div>
          </div>
        </button>

        <button className="menu-item" onClick={onMatchHistory}>
          <div className="menu-icon">📊</div>
          <div className="menu-text">
            <div className="menu-label">Match History</div>
            <div className="menu-description">View your past games</div>
          </div>
        </button>

        <button className="menu-item" onClick={onProfile}>
          <div className="menu-icon">👤</div>
          <div className="menu-text">
            <div className="menu-label">Profile</div>
            <div className="menu-description">View and edit your profile</div>
          </div>
          {friendRequestCount > 0 && (
            <div className="notification-badge">{friendRequestCount}</div>
          )}
        </button>

        <button className="menu-item" onClick={onChat}>
          <div className="menu-icon">💬</div>
          <div className="menu-text">
            <div className="menu-label">Chat</div>
            <div className="menu-description">Direct messages & friends</div>
          </div>
          {notificationCount > 0 && (
            <div className="notification-badge">{notificationCount}</div>
          )}
        </button>

        <button className="menu-item rztv-item" onClick={onRZTV}>
          <div className="menu-icon">📺</div>
          <div className="menu-text">
            <div className="menu-label">RZTV</div>
            <div className="menu-description">Coming Soon!</div>
          </div>
          <div className="coming-soon-tag">SOON</div>
        </button>
      </div>
    </div>
  )
}

export default MainMenuScreen
