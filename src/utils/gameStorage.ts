import { GameLog, GameResult as _GameResult, TimeControlType as _TimeControlType, UserProfile, MedalProgress, PERSONALITY_BOTS, ENGINE_BOTS } from '../types'

const GAME_LOG_KEY = 'chess_game_log'
const MAX_LOGS = 10
const ANALYSIS_COOLDOWN_KEY = 'chess_analysis_last_used'
const ANALYSIS_COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 hours
const USER_PROFILE_KEY = 'chess_user_profile'
const MEDAL_PROGRESS_KEY = 'chess_medal_progress'

// Game log functions
export function getGameLogs(): GameLog[] {
  try {
    const logs = localStorage.getItem(GAME_LOG_KEY)
    return logs ? JSON.parse(logs) : []
  } catch (error) {
    console.error('Error reading game logs:', error)
    return []
  }
}

export function addGameLog(log: Omit<GameLog, 'id' | 'date'>): void {
  try {
    const logs = getGameLogs()
    const newLog: GameLog = {
      ...log,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      date: Date.now()
    }
    
    logs.unshift(newLog) // Add to beginning
    
    // Keep only last MAX_LOGS
    if (logs.length > MAX_LOGS) {
      logs.splice(MAX_LOGS)
    }
    
    localStorage.setItem(GAME_LOG_KEY, JSON.stringify(logs))
  } catch (error) {
    console.error('Error saving game log:', error)
  }
}

export function clearGameLogs(): void {
  try {
    localStorage.removeItem(GAME_LOG_KEY)
  } catch (error) {
    console.error('Error clearing game logs:', error)
  }
}

// Format game log for display
export function formatGameLog(log: GameLog): string {
  const result = log.result === 'win' ? 'beat' : log.result === 'loss' ? 'lost to' : 'drew with'
  const timeControlStr = log.timeControl !== 'normal' ? ` in ${log.timeControl.charAt(0).toUpperCase() + log.timeControl.slice(1)}` : ''
  return `You ${result} ${log.opponent}${timeControlStr}!`
}

// Analysis cooldown functions
export function canUseAnalysis(): boolean {
  try {
    const lastUsed = localStorage.getItem(ANALYSIS_COOLDOWN_KEY)
    if (!lastUsed) return true
    
    const lastUsedTime = parseInt(lastUsed, 10)
    const now = Date.now()
    return now - lastUsedTime >= ANALYSIS_COOLDOWN_MS
  } catch (error) {
    console.error('Error checking analysis cooldown:', error)
    return true
  }
}

export function markAnalysisUsed(): void {
  try {
    localStorage.setItem(ANALYSIS_COOLDOWN_KEY, Date.now().toString())
  } catch (error) {
    console.error('Error marking analysis used:', error)
  }
}

export function getAnalysisCooldownRemaining(): number {
  try {
    const lastUsed = localStorage.getItem(ANALYSIS_COOLDOWN_KEY)
    if (!lastUsed) return 0
    
    const lastUsedTime = parseInt(lastUsed, 10)
    const now = Date.now()
    const remaining = ANALYSIS_COOLDOWN_MS - (now - lastUsedTime)
    return remaining > 0 ? remaining : 0
  } catch (error) {
    console.error('Error getting analysis cooldown:', error)
    return 0
  }
}

export function formatCooldownTime(ms: number): string {
  const hours = Math.floor(ms / (60 * 60 * 1000))
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

// Settings functions
export function getSetting(key: string, defaultValue: boolean = true): boolean {
  try {
    const value = localStorage.getItem(key)
    return value !== null ? value === 'true' : defaultValue
  } catch (error) {
    console.error('Error reading setting:', error)
    return defaultValue
  }
}

export function setSetting(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value.toString())
  } catch (error) {
    console.error('Error saving setting:', error)
  }
}

// Profile functions
export function getUserProfile(): UserProfile {
  try {
    const profile = localStorage.getItem(USER_PROFILE_KEY)
    if (profile) {
      return JSON.parse(profile)
    }
    // Default profile
    return {
      username: 'Player',
      avatar: '👤',
      bio: 'Chess enthusiast',
      elo: 1200,
      beatenBots: []
    }
  } catch (error) {
    console.error('Error reading user profile:', error)
    return {
      username: 'Player',
      avatar: '👤',
      bio: 'Chess enthusiast',
      elo: 1200,
      beatenBots: []
    }
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile))
  } catch (error) {
    console.error('Error saving user profile:', error)
  }
}

export function updateUserProfile(updates: Partial<UserProfile>): void {
  const profile = getUserProfile()
  const updated = { ...profile, ...updates }
  saveUserProfile(updated)
}

// Medal functions
export function getMedalProgress(): MedalProgress {
  try {
    const progress = localStorage.getItem(MEDAL_PROGRESS_KEY)
    if (progress) {
      return JSON.parse(progress)
    }
    // Default progress
    return {
      totalMedals: 0,
      personalityMedals: 0,
      engineMedals: 0,
      beatenBots: []
    }
  } catch (error) {
    console.error('Error reading medal progress:', error)
    return {
      totalMedals: 0,
      personalityMedals: 0,
      engineMedals: 0,
      beatenBots: []
    }
  }
}

export function saveMedalProgress(progress: MedalProgress): void {
  try {
    localStorage.setItem(MEDAL_PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving medal progress:', error)
  }
}

export function awardMedal(botId: string): boolean {
  try {
    const progress = getMedalProgress()
    
    // Check if bot already beaten
    if (progress.beatenBots.includes(botId)) {
      return false // Already have this medal
    }
    
    // Add bot to beaten list
    progress.beatenBots.push(botId)
    
    // Check if it's a personality bot or engine bot
    const isPersonalityBot = PERSONALITY_BOTS.some(bot => bot.id === botId)
    const isEngineBot = ENGINE_BOTS.some(bot => bot.id === botId)
    
    if (isPersonalityBot) {
      progress.personalityMedals++
    } else if (isEngineBot) {
      progress.engineMedals++
    }
    
    progress.totalMedals = progress.personalityMedals + progress.engineMedals
    
    saveMedalProgress(progress)
    
    // Also update user profile
    const profile = getUserProfile()
    profile.beatenBots = progress.beatenBots
    saveUserProfile(profile)
    
    return true // Medal awarded
  } catch (error) {
    console.error('Error awarding medal:', error)
    return false
  }
}

export function hasMedal(botId: string): boolean {
  const progress = getMedalProgress()
  return progress.beatenBots.includes(botId)
}
