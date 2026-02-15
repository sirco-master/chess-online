import { useState, useEffect } from 'react'
import { Club } from '../types'
import { getRandomOpenClubs, getUserClubId, getClubById, initializeDemoClubs } from '../utils/clubStorage'
import { getUserProfile } from '../utils/gameStorage'
import './ClubListScreen.css'

interface ClubListScreenProps {
  onViewClub: (clubId: string) => void
  onCreateClub: () => void
  onBack: () => void
}

function ClubListScreen({ onViewClub, onCreateClub, onBack }: ClubListScreenProps) {
  const [openClubs, setOpenClubs] = useState<Club[]>([])
  const [userClub, setUserClub] = useState<Club | null>(null)
  const [loading, setLoading] = useState(true)
  const profile = getUserProfile()

  useEffect(() => {
    // Initialize demo clubs if needed
    initializeDemoClubs()
    
    // Load user's club if they have one
    const userClubId = getUserClubId(profile.username)
    if (userClubId) {
      const club = getClubById(userClubId)
      setUserClub(club)
    }
    
    // Load random open clubs
    setOpenClubs(getRandomOpenClubs(10))
    setLoading(false)
  }, [profile.username])

  const handleRefreshClubs = () => {
    setOpenClubs(getRandomOpenClubs(10))
  }

  if (loading) {
    return (
      <div className="club-list-screen">
        <div className="loading-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-items">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-item"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="club-list-screen">
      <div className="club-list-header">
        <h1>♔ Chess Clubs</h1>
        <button className="back-button" onClick={onBack}>← Back</button>
      </div>

      {/* User's club section */}
      {userClub ? (
        <div className="user-club-section">
          <h2>Your Club</h2>
          <div className="club-card user-club-card" onClick={() => onViewClub(userClub.id)}>
            <div className="club-header">
              <div className="club-icon">🏆</div>
              <div className="club-info">
                <div className="club-name">{userClub.name}</div>
                <div className="club-members-count">
                  {userClub.members.length}/{userClub.maxMembers} members
                </div>
              </div>
              <div className="club-trophies">
                <span className="trophy-icon">🏆</span>
                <span className="trophy-count">{userClub.trophies}</span>
              </div>
            </div>
            <div className="club-bio">{userClub.bio}</div>
            <div className="club-footer">
              <span className="club-visibility-badge">{userClub.visibility}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-club-section">
          <p>You're not in a club yet!</p>
          <button className="create-club-button" onClick={onCreateClub}>
            ➕ Create Club
          </button>
        </div>
      )}

      {/* Open clubs section */}
      <div className="open-clubs-section">
        <div className="section-header">
          <h2>Discover Clubs</h2>
          <button className="refresh-button" onClick={handleRefreshClubs}>
            🔄 Refresh
          </button>
        </div>
        
        {openClubs.length === 0 ? (
          <div className="no-clubs-message">
            <p>No open clubs available at the moment.</p>
            <p>Be the first to create one!</p>
          </div>
        ) : (
          <div className="clubs-grid">
            {openClubs.map(club => (
              <div 
                key={club.id} 
                className="club-card" 
                onClick={() => onViewClub(club.id)}
              >
                <div className="club-header">
                  <div className="club-icon">🏰</div>
                  <div className="club-info">
                    <div className="club-name">{club.name}</div>
                    <div className="club-members-count">
                      {club.members.length}/{club.maxMembers} members
                    </div>
                  </div>
                  <div className="club-trophies">
                    <span className="trophy-icon">🏆</span>
                    <span className="trophy-count">{club.trophies}</span>
                  </div>
                </div>
                <div className="club-bio">{club.bio}</div>
                <div className="club-footer">
                  <span className="club-visibility-badge open">{club.visibility}</span>
                  <span className="join-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Club invites section - TODO */}
      <div className="club-invites-section">
        <h2>📨 Club Invites</h2>
        <div className="placeholder-message">
          <p>Club invites will appear here</p>
          <p className="todo-note">TODO: Implement club invite system via DMs</p>
        </div>
      </div>
    </div>
  )
}

export default ClubListScreen
