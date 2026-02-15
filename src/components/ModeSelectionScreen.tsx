import { useState } from 'react'
import { BotCategory, PERSONALITY_BOTS_BY_CATEGORY, ENGINE_BOTS, TIME_CONTROLS, TimeControlType, PersonalityBot, EngineBot, PlayMode } from '../types'
import { GameConfig } from '../App'
import { hasMedal } from '../utils/gameStorage'
import './ModeSelectionScreen.css'

interface ModeSelectionScreenProps {
  onStartGame: (config: GameConfig) => void
  onStartOnline: () => void
  onBack: () => void
}

type SelectionStep = 'mode' | 'bot-category' | 'bot-list' | 'play-mode' | 'game-setup'

const BOT_CATEGORIES: { category: BotCategory; name: string; icon: string; description: string }[] = [
  { category: 'beginner', name: 'Beginner', icon: '🐣', description: 'ELO 200-500 - Perfect for learning' },
  { category: 'intermediate', name: 'Intermediate', icon: '🎯', description: 'ELO 600-1000 - Tactical challenges' },
  { category: 'master', name: 'Master', icon: '♟️', description: 'ELO 1200-1600 - Advanced play' },
  { category: 'champion', name: 'Champion', icon: '👑', description: 'ELO 1800-2200 - Elite opponents' },
  { category: 'historical', name: 'Historical', icon: '🎩', description: 'ELO 1400-2400 - Legendary styles' },
  { category: 'rzplay-staff', name: 'RzPlay Staff', icon: '⚙️', description: 'ELO 250-2600 - Unique bots' },
  { category: 'engine', name: 'Engine', icon: '🤖', description: 'ELO 150-3200 - Pure strength' }
]

function ModeSelectionScreen({ onStartGame, onStartOnline, onBack }: ModeSelectionScreenProps) {
  const [step, setStep] = useState<SelectionStep>('mode')
  const [selectedCategory, setSelectedCategory] = useState<BotCategory | null>(null)
  const [selectedPersonalityBot, setSelectedPersonalityBot] = useState<PersonalityBot | null>(null)
  const [selectedEngineBot, setSelectedEngineBot] = useState<EngineBot | null>(null)
  const [selectedPlayMode, setSelectedPlayMode] = useState<PlayMode>('normal')
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControlType>('normal')
  const [selectedColor, setSelectedColor] = useState<'white' | 'black'>('white')
  const [is2Player, setIs2Player] = useState(false)

  const handleModeSelect = (mode: 'bot' | '2-player' | 'online') => {
    if (mode === 'online') {
      onStartOnline()
    } else if (mode === '2-player') {
      setIs2Player(true)
      setSelectedPlayMode('friendly') // 2-player is always friendly mode
      setStep('game-setup')
    } else {
      setIs2Player(false)
      setStep('bot-category')
    }
  }

  const handleCategorySelect = (category: BotCategory) => {
    setSelectedCategory(category)
    setStep('bot-list')
  }

  const handleBotSelect = (bot: PersonalityBot | EngineBot) => {
    if ('personality' in bot) {
      // PersonalityBot
      setSelectedPersonalityBot(bot as PersonalityBot)
      setSelectedEngineBot(null)
    } else {
      // EngineBot
      setSelectedEngineBot(bot as EngineBot)
      setSelectedPersonalityBot(null)
    }
    setStep('play-mode')
  }

  const handlePlayModeSelect = (playMode: PlayMode) => {
    setSelectedPlayMode(playMode)
    setStep('game-setup')
  }

  const handleStartGame = () => {
    let mode: GameConfig['mode'] = 'single-player'
    if (is2Player) {
      mode = '2-player'
    } else if (selectedPersonalityBot) {
      mode = 'personality-bot'
    } else if (selectedEngineBot) {
      mode = 'engine-bot'
    }

    const config: GameConfig = {
      mode,
      personalityBot: selectedPersonalityBot || undefined,
      engineBot: selectedEngineBot || undefined,
      timeControl: selectedTimeControl,
      playerColor: selectedColor,
      playMode: selectedPlayMode
    }
    onStartGame(config)
  }

  const handleBackStep = () => {
    switch (step) {
      case 'bot-category':
        setStep('mode')
        break
      case 'bot-list':
        setStep('bot-category')
        break
      case 'play-mode':
        setStep('bot-list')
        break
      case 'game-setup':
        if (is2Player) {
          setStep('mode')
        } else {
          setStep('play-mode')
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
              <button className="mode-option-button online" onClick={() => handleModeSelect('online')}>
                🌐 Play Online
              </button>
            </div>
            <button className="back-button" onClick={onBack}>
              ← Back to Home
            </button>
          </>
        )}

        {step === 'bot-category' && (
          <>
            <h1 className="mode-title">Choose Bot Category</h1>
            <div className="bot-category-grid">
              {BOT_CATEGORIES.map((cat) => (
                <button
                  key={cat.category}
                  className="bot-category-button"
                  onClick={() => handleCategorySelect(cat.category)}
                >
                  <div className="bot-category-icon">{cat.icon}</div>
                  <div className="bot-category-name">{cat.name}</div>
                  <div className="bot-category-desc">{cat.description}</div>
                </button>
              ))}
            </div>
            <button className="back-button" onClick={handleBackStep}>
              ← Back
            </button>
          </>
        )}

        {step === 'bot-list' && selectedCategory && (
          <>
            <h1 className="mode-title">
              {BOT_CATEGORIES.find(c => c.category === selectedCategory)?.name} Bots
            </h1>
            <div className="bot-list-grid">
              {selectedCategory === 'engine' ? (
                // Engine bots - display as ELO only
                ENGINE_BOTS.map((bot) => (
                  <button
                    key={bot.id}
                    className="bot-list-button"
                    onClick={() => handleBotSelect(bot)}
                  >
                    <div className="bot-avatar">{bot.avatar}</div>
                    <div className="bot-name">{bot.elo} ELO</div>
                    {hasMedal(bot.id) && <div className="bot-medal">🏅</div>}
                  </button>
                ))
              ) : (
                // Personality bots
                PERSONALITY_BOTS_BY_CATEGORY[selectedCategory].map((bot) => (
                  <button
                    key={bot.id}
                    className="bot-list-button"
                    onClick={() => handleBotSelect(bot)}
                  >
                    <div className="bot-avatar">{bot.avatar}</div>
                    <div className="bot-name">{bot.name}</div>
                    <div className="bot-personality">{bot.personality}</div>
                    <div className="bot-elo">{bot.elo} ELO</div>
                    {hasMedal(bot.id) && <div className="bot-medal">🏅</div>}
                  </button>
                ))
              )}
            </div>
            <button className="back-button" onClick={handleBackStep}>
              ← Back
            </button>
          </>
        )}

        {step === 'play-mode' && (
          <>
            <h1 className="mode-title">Choose Play Mode</h1>
            <div className="play-mode-options">
              <button
                className="play-mode-button"
                onClick={() => handlePlayModeSelect('normal')}
              >
                <div className="play-mode-icon">⚔️</div>
                <div className="play-mode-name">Normal Mode</div>
                <div className="play-mode-desc">No hints or takebacks. Earn medals!</div>
              </button>
              <button
                className="play-mode-button"
                onClick={() => handlePlayModeSelect('friendly')}
              >
                <div className="play-mode-icon">🤝</div>
                <div className="play-mode-name">Friendly Mode</div>
                <div className="play-mode-desc">Unlimited hints and takebacks. No medals.</div>
              </button>
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
                <>
                  <p>
                    Playing as <strong>{selectedColor === 'white' ? 'White' : 'Black'}</strong> vs{' '}
                    <strong>
                      {selectedPersonalityBot ? selectedPersonalityBot.name : 
                       selectedEngineBot ? `${selectedEngineBot.elo} ELO` : 'Bot'}
                    </strong>
                  </p>
                  <p>
                    Mode: <strong>{selectedPlayMode === 'normal' ? 'Normal (Medals Enabled)' : 'Friendly (Practice)'}</strong>
                  </p>
                </>
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
