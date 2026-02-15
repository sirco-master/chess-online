import './ChatScreen.css'

interface ChatScreenProps {
  onBack: () => void
}

function ChatScreen({ onBack }: ChatScreenProps) {
  return (
    <div className="chat-screen">
      <div className="chat-header">
        <h1>💬 Chat & Friends</h1>
        <button className="back-button" onClick={onBack}>← Back</button>
      </div>

      <div className="chat-container">
        <div className="placeholder-section">
          <div className="placeholder-icon">👥</div>
          <h2>Friends & Messaging</h2>
          <p>Connect with other chess players</p>
          
          <div className="feature-preview">
            <div className="preview-item">
              <span className="preview-icon">🔍</span>
              <span className="preview-text">Search users</span>
            </div>
            <div className="preview-item">
              <span className="preview-icon">👤</span>
              <span className="preview-text">View profiles</span>
            </div>
            <div className="preview-item">
              <span className="preview-icon">💬</span>
              <span className="preview-text">Direct messages</span>
            </div>
            <div className="preview-item">
              <span className="preview-icon">🚫</span>
              <span className="preview-text">Block users</span>
            </div>
            <div className="preview-item">
              <span className="preview-icon">🤝</span>
              <span className="preview-text">Friend requests</span>
            </div>
            <div className="preview-item">
              <span className="preview-icon">📧</span>
              <span className="preview-text">Club invites</span>
            </div>
          </div>

          <div className="todo-box">
            <p>TODO: Implement full chat and friends system:</p>
            <ul>
              <li>User search with fuzzy matching</li>
              <li>View other profiles (avatar, ELO, club, medals, title)</li>
              <li>Friend request system with notifications</li>
              <li>Direct messaging (1-on-1)</li>
              <li>Blocking system (prevents all contact)</li>
              <li>DM toggle setting</li>
              <li>Club invites via special DM</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatScreen
