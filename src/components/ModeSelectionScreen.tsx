import { useState } from 'react'
import { Difficulty, PERSONALITY_BOTS, TIME_CONTROLS, TimeControlType, PersonalityBot } from '../types'
import { GameConfig } from '../App'
import './ModeSelectionScreen.css'

interface ModeSelectionScreenProps {
  onStartGame: (config: GameConfig) => void
  onBack: () => void
}

const classicDifficulties: { name: string; difficulty: Difficulty; elo: number }[] = [
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

type SelectionStep = 'mode' | 'bot-type' | 'classic-difficulty' | 'personality-bot' | 'game-setup'

function ModeSelectionScreen({ onStartGame, onBack }: ModeSelectionScreenProps) {
  const [step, setStep] = useState<SelectionStep>('mode')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('beginner')
  const [selectedPersonalityBot, setSelectedPersonalityBot] = useState<PersonalityBot | null>(null)
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControlType>('normal')
  const [selectedColor, setSelectedColor] = useState<'white' | 'black'>('white')
  const [is2Player, setIs2Player] = useState(false)

  const handleModeSelect = (mode: 'bot' | '2-player') => {
    if (mode === '2-player') {
      setIs2Player(true)
      setStep('game-setup')
    } else {
      setIs2Player(false)
      setStep('bot-type')
    }
  }

  const handleBotTypeSelect = (type: 'classic' | 'personality') => {
    if (type === 'classic') {
      setStep('classic-difficulty')
    } else {
      setStep('personality-bot')
    }
  }

  const handleClassicDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty)
    setSelectedPersonalityBot(null)
    setStep('game-setup')
  }

  const handlePersonalityBotSelect = (bot: PersonalityBot) => {
    setSelectedPersonalityBot(bot)
    setSelectedDifficulty(bot.difficulty)
    setStep('game-setup')
  }

  const handleStartGame = () => {
    const config: GameConfig = {
      mode: is2Player ? '2-player' : selectedPersonalityBot ? 'personality-bot' : 'single-player',
      difficulty: selectedDifficulty,
      personalityBot: selectedPersonalityBot || undefined,
      timeControl: selectedTimeControl,
      playerColor: selectedColor
    }
    onStartGame(config)
  }

  const handleBackStep = () => {
    switch (step) {
      case 'bot-type':
        setStep('mode')
        break
      case 'classic-difficulty':
      case 'personality-bot':
        setStep('bot-type')
        break
      case 'game-setup':
        if (is2Player) {
          setStep('mode')
        } else if (selectedPersonalityBot) {
          setStep('personality-bot')
        } else {
          setStep('classic-difficulty')
        }
        break
      default:
        onBack()
    }
  }

  return (
    <div className="mode-selection-screen">
      <div className="mode-container">
        {step === 'mode' && (
          <>
            <h1 className="mode-title">Choose Game Mode</h1>
            <div className="mode-options">
              <button className="mode-option-button" onClick={() => handleModeSelect('bot')}>
                🤖 Play vs Bot
              </button>
              <button className="mode-option-button" onClick={() => handleModeSelect('2-player')}>
                👥 2 Player Local
              </button>
            </div>
            <button className="back-button" onClick={onBack}>
              ← Back to Home
            </button>
          </>
        )}

        {step === 'bot-type' && (
          <>
            <h1 className="mode-title">Choose Bot Type</h1>
            <div className="bot-type-options">
              <button className="bot-type-button" onClick={() => handleBotTypeSelect('personality')}>
                <div className="bot-type-icon">🎭</div>
                <div className="bot-type-name">Personality Bots</div>
                <div className="bot-type-desc">Unique playing styles and characters</div>
              </button>
              <button className="bot-type-button" onClick={() => handleBotTypeSelect('classic')}>
                <div className="bot-type-icon">🎯</div>
                <div className="bot-type-name">Classic Difficulty</div>
                <div className="bot-type-desc">Traditional ELO-based opponents</div>
              </button>
            </div>
            <button className="back-button" onClick={handleBackStep}>
              ← Back
            </button>
          </>
        )}

        {step === 'classic-difficulty' && (
          <>
            <h1 className="mode-title">Choose Difficulty</h1>
            <div className="difficulty-grid">
              {classicDifficulties.map((diff) => (
                <button
                  key={diff.difficulty}
                  className="difficulty-button"
                  onClick={() => handleClassicDifficultySelect(diff.difficulty)}
                >
                  <div className="difficulty-name">{diff.name}</div>
                  <div className="difficulty-elo">{diff.elo} ELO</div>
                </button>
              ))}
            </div>
            <button className="back-button" onClick={handleBackStep}>
              ← Back
            </button>
          </>
        )}

        {step === 'personality-bot' && (
          <>
            <h1 className="mode-title">Choose Your Opponent</h1>
            <div className="personality-bot-grid">
              {PERSONALITY_BOTS.map((bot) => (
                <button
                  key={bot.id}
                  className="personality-bot-button"
                  onClick={() => handlePersonalityBotSelect(bot)}
                >
                  <div className="bot-avatar">{bot.avatar}</div>
                  <div className="bot-name">{bot.name}</div>
                  <div className="bot-personality">{bot.personality}</div>
                  <div className="bot-description">{bot.description}</div>
                </button>
              ))}
            </div>
            <button className="back-button" onClick={handleBackStep}>
              ← Back
            </button>
          </>
        )}

        {step === 'game-setup' && (
          <>
            <h1 className="mode-title">Game Setup</h1>
            
            <div className="setup-section">
              <h3 className="setup-label">Time Control</h3>
              <div className="time-control-grid">
                {Object.entries(TIME_CONTROLS).map(([key, tc]) => (
                  <button
                    key={key}
                    className={`time-control-button ${selectedTimeControl === key ? 'selected' : ''}`}
                    onClick={() => setSelectedTimeControl(key as TimeControlType)}
                  >
                    <div className="tc-name">{tc.name}</div>
                    {tc.timePerSide > 0 && (
                      <div className="tc-time">{Math.floor(tc.timePerSide / 60)}+{tc.increment}</div>
                    )}
                    {tc.timePerSide === 0 && (
                      <div className="tc-time">No Clock</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {!is2Player && (
              <div className="setup-section">
                <h3 className="setup-label">Your Color</h3>
                <div className="color-selection">
                  <button
                    className={`color-button ${selectedColor === 'white' ? 'selected' : ''}`}
                    onClick={() => setSelectedColor('white')}
                  >
                    <span className="color-icon">⚪</span>
                    <span>White</span>
                  </button>
                  <button
                    className={`color-button ${selectedColor === 'black' ? 'selected' : ''}`}
                    onClick={() => setSelectedColor('black')}
                  >
                    <span className="color-icon">⚫</span>
                    <span>Black</span>
                  </button>
                </div>
              </div>
            )}

            <div className="setup-summary">
              {!is2Player && (
                <p>
                  Playing as <strong>{selectedColor === 'white' ? 'White' : 'Black'}</strong> vs{' '}
                  <strong>
                    {selectedPersonalityBot ? selectedPersonalityBot.name : 
                     classicDifficulties.find(d => d.difficulty === selectedDifficulty)?.name}
                  </strong>
                </p>
              )}
              <p>
                Time Control: <strong>{TIME_CONTROLS[selectedTimeControl].name}</strong>
              </p>
            </div>

            <button className="start-game-button" onClick={handleStartGame}>
              ▶️ Start Game
            </button>
            
            <button className="back-button" onClick={handleBackStep}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ModeSelectionScreen
