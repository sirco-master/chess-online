import { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import ModeSelectionScreen from './components/ModeSelectionScreen'
import GameScreen from './components/GameScreen'
import GameLogScreen from './components/GameLogScreen'
import { Screen, GameMode, Difficulty, TimeControlType, PersonalityBot } from './types'

export interface GameConfig {
  mode: GameMode
  difficulty?: Difficulty
  personalityBot?: PersonalityBot
  timeControl: TimeControlType
  playerColor: 'white' | 'black'
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    mode: 'single-player',
    difficulty: 'beginner',
    timeControl: 'normal',
    playerColor: 'white'
  })

  const startGame = (config: GameConfig) => {
    setGameConfig(config)
    setCurrentScreen('game')
  }

  const goToModeSelection = () => {
    setCurrentScreen('mode-selection')
  }

  const goToGameLog = () => {
    setCurrentScreen('game-log')
  }

  const goToHome = () => {
    setCurrentScreen('home')
  }

  return (
    <>
      {currentScreen === 'home' && (
        <HomeScreen 
          onPlay={goToModeSelection} 
          onViewGameLog={goToGameLog}
        />
      )}
      {currentScreen === 'mode-selection' && (
        <ModeSelectionScreen 
          onStartGame={startGame} 
          onBack={goToHome} 
        />
      )}
      {currentScreen === 'game' && (
        <GameScreen 
          config={gameConfig}
          onBack={goToHome}
          onViewGameLog={goToGameLog}
        />
      )}
      {currentScreen === 'game-log' && (
        <GameLogScreen onBack={goToHome} />
      )}
    </>
  )
}

export default App
