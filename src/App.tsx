import { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import ModeSelectionScreen from './components/ModeSelectionScreen'
import GameScreen from './components/GameScreen'
import GameLogScreen from './components/GameLogScreen'
import OnlineSetupScreen from './components/OnlineSetupScreen'
import OnlineLobbyScreen from './components/OnlineLobbyScreen'
import ProfileScreen from './components/ProfileScreen'
import { Screen, GameMode, Difficulty, TimeControlType, PersonalityBot, EngineBot, PlayMode } from './types'

export interface GameConfig {
  mode: GameMode
  difficulty?: Difficulty
  personalityBot?: PersonalityBot
  engineBot?: EngineBot
  timeControl: TimeControlType
  playerColor: 'white' | 'black'
  playMode: PlayMode // normal or friendly
  gameId?: string // For online games
  opponentName?: string // For online games
  opponentAvatar?: string // For online games
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    mode: 'single-player',
    difficulty: 'beginner',
    timeControl: 'normal',
    playerColor: 'white',
    playMode: 'normal'
  })
  const [onlineUsername, setOnlineUsername] = useState('')
  const [onlineAvatar, setOnlineAvatar] = useState('')

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

  const goToProfile = () => {
    setCurrentScreen('profile')
  }

  const goToOnlineSetup = () => {
    setCurrentScreen('online-setup')
  }

  const handleOnlineSetupComplete = (username: string, avatar: string) => {
    setOnlineUsername(username)
    setOnlineAvatar(avatar)
    setCurrentScreen('online-lobby')
  }

  const handleOnlineGameStart = (gameData: any) => {
    const config: GameConfig = {
      mode: gameData.color === 'white' ? 'online-public' : 'online-private',
      timeControl: gameData.timeControl || 'blitz',
      playerColor: gameData.color,
      playMode: 'normal', // Online games are always normal mode
      gameId: gameData.gameId,
      opponentName: gameData.opponent.username,
      opponentAvatar: gameData.opponent.avatar
    }
    startGame(config)
  }

  return (
    <>
      {currentScreen === 'home' && (
        <HomeScreen 
          onPlay={goToModeSelection} 
          onViewGameLog={goToGameLog}
          onViewProfile={goToProfile}
        />
      )}
      {currentScreen === 'mode-selection' && (
        <ModeSelectionScreen 
          onStartGame={startGame}
          onStartOnline={goToOnlineSetup}
          onBack={goToHome} 
        />
      )}
      {currentScreen === 'online-setup' && (
        <OnlineSetupScreen
          onSetupComplete={handleOnlineSetupComplete}
          onBack={goToModeSelection}
        />
      )}
      {currentScreen === 'online-lobby' && (
        <OnlineLobbyScreen
          username={onlineUsername}
          avatar={onlineAvatar}
          onGameStart={handleOnlineGameStart}
          onBack={goToModeSelection}
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
      {currentScreen === 'profile' && (
        <ProfileScreen onBack={goToHome} />
      )}
    </>
  )
}

export default App
