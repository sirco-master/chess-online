import { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import ModeSelectionScreen from './components/ModeSelectionScreen'
import GameScreen from './components/GameScreen'

export type Screen = 'home' | 'mode-selection' | 'game'
export type GameMode = 'single-player' | '2-player'
export type Difficulty = 'practice' | 'beginner' | 'easy' | 'intermediate' | 'moderate' | 'tough' | 'hard' | 'insane' | 'extreme' | 'impossible'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [gameMode, setGameMode] = useState<GameMode>('single-player')
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')

  const startGame = (mode: GameMode, diff?: Difficulty) => {
    setGameMode(mode)
    if (diff) {
      setDifficulty(diff)
    }
    setCurrentScreen('game')
  }

  const goToModeSelection = () => {
    setCurrentScreen('mode-selection')
  }

  const goToHome = () => {
    setCurrentScreen('home')
  }

  return (
    <>
      {currentScreen === 'home' && <HomeScreen onPlay={goToModeSelection} />}
      {currentScreen === 'mode-selection' && (
        <ModeSelectionScreen onSelectMode={startGame} onBack={goToHome} />
      )}
      {currentScreen === 'game' && (
        <GameScreen mode={gameMode} difficulty={difficulty} onBack={goToHome} />
      )}
    </>
  )
}

export default App
