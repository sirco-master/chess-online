import { useState } from 'react'
import HomeScreen from './components/HomeScreen'
import WelcomeScreen from './components/WelcomeScreen'
import MainMenuScreen from './components/MainMenuScreen'
import ModeSelectionScreen from './components/ModeSelectionScreen'
import GameScreen from './components/GameScreen'
import GameLogScreen from './components/GameLogScreen'
import OnlineSetupScreen from './components/OnlineSetupScreen'
import OnlineLobbyScreen from './components/OnlineLobbyScreen'
import ProfileScreen from './components/ProfileScreen'
import ClubListScreen from './components/ClubListScreen'
import ChatScreen from './components/ChatScreen'
import RZTVScreen from './components/RZTVScreen'
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
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome')
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

  const goToWelcome = () => {
    setCurrentScreen('welcome')
  }

  const goToMainMenu = () => {
    setCurrentScreen('main-menu')
  }

  const goToModeSelection = () => {
    setCurrentScreen('mode-selection')
  }

  const goToGameLog = () => {
    setCurrentScreen('game-log')
  }

  const goToProfile = () => {
    setCurrentScreen('profile')
  }

  const goToClubs = () => {
    setCurrentScreen('clubs')
  }

  const goToChat = () => {
    setCurrentScreen('chat')
  }

  const goToRZTV = () => {
    setCurrentScreen('rztv')
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

  const handleViewClub = (clubId: string) => {
    // TODO: Navigate to club detail screen
    console.log('View club:', clubId)
  }

  const handleCreateClub = () => {
    // TODO: Navigate to create club screen
    console.log('Create club')
  }

  return (
    <>
      {currentScreen === 'welcome' && (
        <WelcomeScreen onPlay={goToMainMenu} />
      )}
      {currentScreen === 'main-menu' && (
        <MainMenuScreen
          onPlayOnline={goToOnlineSetup}
          onPlayLocally={() => {
            // 2-player local mode
            startGame({
              mode: '2-player',
              timeControl: 'normal',
              playerColor: 'white',
              playMode: 'friendly'
            })
          }}
          onPlayBots={goToModeSelection}
          onMatchHistory={goToGameLog}
          onProfile={goToProfile}
          onChat={goToChat}
          onRZTV={goToRZTV}
          onClubs={goToClubs}
          onBack={goToWelcome}
        />
      )}
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
          onBack={goToMainMenu} 
        />
      )}
      {currentScreen === 'online-setup' && (
        <OnlineSetupScreen
          onSetupComplete={handleOnlineSetupComplete}
          onBack={goToMainMenu}
        />
      )}
      {currentScreen === 'online-lobby' && (
        <OnlineLobbyScreen
          username={onlineUsername}
          avatar={onlineAvatar}
          onGameStart={handleOnlineGameStart}
          onBack={goToMainMenu}
        />
      )}
      {currentScreen === 'game' && (
        <GameScreen 
          config={gameConfig}
          onBack={goToMainMenu}
          onViewGameLog={goToGameLog}
        />
      )}
      {currentScreen === 'game-log' && (
        <GameLogScreen onBack={goToMainMenu} />
      )}
      {currentScreen === 'profile' && (
        <ProfileScreen onBack={goToMainMenu} />
      )}
      {currentScreen === 'clubs' && (
        <ClubListScreen
          onViewClub={handleViewClub}
          onCreateClub={handleCreateClub}
          onBack={goToMainMenu}
        />
      )}
      {currentScreen === 'chat' && (
        <ChatScreen onBack={goToMainMenu} />
      )}
      {currentScreen === 'rztv' && (
        <RZTVScreen onBack={goToMainMenu} />
      )}
    </>
  )
}

export default App
