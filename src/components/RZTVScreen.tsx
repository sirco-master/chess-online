import './RZTVScreen.css'

interface RZTVScreenProps {
  onBack: () => void
}

function RZTVScreen({ onBack }: RZTVScreenProps) {
  return (
    <div className="rztv-screen">
      <div className="rztv-container">
        <div className="rztv-icon">📺</div>
        <h1 className="rztv-title">RZTV</h1>
        <p className="rztv-subtitle">Spectate & Learn</p>
        
        <div className="coming-soon-box">
          <div className="pulse-icon">🚀</div>
          <h2>Coming Soon!</h2>
          <p>Watch live matches, learn from the pros, and enjoy chess content</p>
          
          <div className="planned-features">
            <div className="feature-item">
              <span className="feature-icon">🎥</span>
              <span className="feature-text">Live game spectating</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <span className="feature-text">Tournament broadcasts</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📚</span>
              <span className="feature-text">Educational content</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⭐</span>
              <span className="feature-text">Pro player showcases</span>
            </div>
          </div>
        </div>

        <button className="back-button-rztv" onClick={onBack}>
          ← Back to Menu
        </button>

        <div className="todo-section">
          <p className="todo-text">TODO: Implement live streaming, VODs, and educational chess content</p>
        </div>
      </div>
    </div>
  )
}

export default RZTVScreen
