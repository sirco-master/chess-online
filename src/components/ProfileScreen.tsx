import { useState, useEffect } from 'react'
import { getUserProfile, saveUserProfile, getMedalProgress } from '../utils/gameStorage'
import { AVATARS, UserProfile, MedalProgress } from '../types'
import './ProfileScreen.css'

interface ProfileScreenProps {
  onBack: () => void
}

function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [medals, setMedals] = useState<MedalProgress | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editUsername, setEditUsername] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editAvatar, setEditAvatar] = useState('')

  useEffect(() => {
    const loadedProfile = getUserProfile()
    const loadedMedals = getMedalProgress()
    setProfile(loadedProfile)
    setMedals(loadedMedals)
    setEditUsername(loadedProfile.username)
    setEditBio(loadedProfile.bio)
    setEditAvatar(loadedProfile.avatar)
  }, [])

  const handleSave = () => {
    if (profile) {
      const updatedProfile: UserProfile = {
        ...profile,
        username: editUsername,
        bio: editBio,
        avatar: editAvatar
      }
      saveUserProfile(updatedProfile)
      setProfile(updatedProfile)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setEditUsername(profile.username)
      setEditBio(profile.bio)
      setEditAvatar(profile.avatar)
      setIsEditing(false)
    }
  }

  if (!profile || !medals) {
    return <div className="profile-screen">Loading...</div>
  }

  return (
    <div className="profile-screen">
      <div className="profile-container">
        <h1 className="profile-title">Your Profile</h1>

        {!isEditing ? (
          <>
            <div className="profile-card">
              <div className="profile-avatar-large">{profile.avatar}</div>
              <h2 className="profile-username">{profile.username}</h2>
              <div className="profile-elo">ELO: {profile.elo}</div>
              <div className="profile-bio">{profile.bio}</div>
              
              <div className="profile-medals">
                <div className="medal-section">
                  <div className="medal-icon">🏅</div>
                  <div className="medal-count">{medals.totalMedals} / 50</div>
                  <div className="medal-label">Total Medals</div>
                </div>
                <div className="medal-breakdown">
                  <div className="medal-item">
                    <span>Personality Bots:</span>
                    <span>{medals.personalityMedals} / 36</span>
                  </div>
                  <div className="medal-item">
                    <span>Engine Bots:</span>
                    <span>{medals.engineMedals} / 14</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="edit-profile-button" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <div className="profile-edit-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                maxLength={20}
                className="profile-input"
              />
            </div>

            <div className="form-group">
              <label>Avatar</label>
              <div className="avatar-selector">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    className={`avatar-option ${editAvatar === avatar ? 'selected' : ''}`}
                    onClick={() => setEditAvatar(avatar)}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                maxLength={100}
                rows={3}
                className="profile-textarea"
              />
            </div>

            <div className="form-actions">
              <button className="save-button" onClick={handleSave}>
                💾 Save
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>
      </div>
    </div>
  )
}

export default ProfileScreen
