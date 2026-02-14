import { GameMode, Difficulty } from '../App'
import './ModeSelectionScreen.css'

interface ModeSelectionScreenProps {
  onSelectMode: (mode: GameMode, difficulty?: Difficulty) => void
  onBack: () => void
}

const difficulties: { name: string; difficulty: Difficulty; elo: number }[] = [
  { name: 'Practice', difficulty: 'practice', elo: 150 },
  { name: 'Beginner', difficulty: 'beginner', elo: 300 },
  { name: 'Easy', difficulty: 'easy', elo: 500 },
  { name: 'Intermediate', difficulty: 'intermediate', elo: 800 },
  { name: 'Moderate', difficulty: 'moderate', elo: 1200 },
  { name: 'Tough', difficulty: 'tough', elo: 1500 },
  { name: 'Hard', difficulty: 'hard', elo: 1800 },
  { name: 'Insane', difficulty: 'insane', elo: 2100 },
  { name: 'Extreme', difficulty: 'extreme', elo: 2500 },
  { name: 'Impossible', difficulty: 'impossible', elo: 3000 },
]

function ModeSelectionScreen({ onSelectMode, onBack }: ModeSelectionScreenProps) {
  return (
    <div className="mode-selection-screen">
      <div className="mode-container">
        <h1 className="mode-title">Choose your difficulty</h1>
        
        <div className="difficulty-grid">
          {difficulties.map((diff) => (
            <button
              key={diff.difficulty}
              className="difficulty-button"
              onClick={() => onSelectMode('single-player', diff.difficulty)}
            >
              <div className="difficulty-name">{diff.name}</div>
              <div className="difficulty-elo">{diff.elo} ELO</div>
            </button>
          ))}
        </div>

        <button
          className="two-player-button"
          onClick={() => onSelectMode('2-player')}
        >
          2 Player Mode
        </button>

        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  )
}

export default ModeSelectionScreen
