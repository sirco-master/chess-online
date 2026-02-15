// Core game types
export type Screen = 'home' | 'mode-selection' | 'game' | 'game-log' | 'online-setup' | 'online-lobby'
export type GameMode = 'single-player' | '2-player' | 'online-public' | 'online-private' | 'personality-bot'
export type Difficulty = 'practice' | 'beginner' | 'easy' | 'intermediate' | 'moderate' | 'tough' | 'hard' | 'insane' | 'extreme' | 'impossible'

// Time control types
export type TimeControlType = 'normal' | 'rapid' | 'blitz' | 'bullet'

export interface TimeControl {
  type: TimeControlType
  name: string
  timePerSide: number // in seconds, 0 for normal (no clock)
  increment: number // increment per move in seconds
}

export const TIME_CONTROLS: Record<TimeControlType, TimeControl> = {
  normal: { type: 'normal', name: 'Normal', timePerSide: 0, increment: 0 },
  rapid: { type: 'rapid', name: 'Rapid', timePerSide: 600, increment: 5 }, // 10 min + 5 sec
  blitz: { type: 'blitz', name: 'Blitz', timePerSide: 180, increment: 2 }, // 3 min + 2 sec
  bullet: { type: 'bullet', name: 'Bullet', timePerSide: 60, increment: 1 }, // 1 min + 1 sec
}

// Personality bot types
export interface PersonalityBot {
  id: string
  name: string
  personality: string
  description: string
  difficulty: Difficulty
  avatar: string // emoji or icon
}

export const PERSONALITY_BOTS: PersonalityBot[] = [
  {
    id: 'amelia',
    name: 'Amelia',
    personality: 'Aggressive Attacker',
    description: 'Loves tactical fireworks and sacrificial attacks. Plays bold and fearless.',
    difficulty: 'intermediate',
    avatar: '👩'
  },
  {
    id: 'boris',
    name: 'Boris',
    personality: 'Solid Positional',
    description: 'Patient and methodical. Focuses on strong pawn structure and piece coordination.',
    difficulty: 'moderate',
    avatar: '👨'
  },
  {
    id: 'avi',
    name: 'Avi',
    personality: 'Endgame Specialist',
    description: 'Trades pieces to reach endgames where precision matters most.',
    difficulty: 'tough',
    avatar: '🧔'
  },
  {
    id: 'elena',
    name: 'Elena',
    personality: 'Creative Genius',
    description: 'Unpredictable and imaginative. Loves unusual openings and surprising moves.',
    difficulty: 'hard',
    avatar: '👩‍🦰'
  },
  {
    id: 'magnus',
    name: 'Magnus',
    personality: 'Universal Player',
    description: 'Adaptable and strong in all phases. The ultimate challenge.',
    difficulty: 'extreme',
    avatar: '🤴'
  },
  {
    id: 'sophia',
    name: 'Sophia',
    personality: 'Strategic Planner',
    description: 'Thinks many moves ahead. Excels at long-term planning and strategy.',
    difficulty: 'insane',
    avatar: '👸'
  }
]

// Game result types
export type GameResult = 'win' | 'loss' | 'draw'

export interface GameLog {
  id: string
  date: number // timestamp
  opponent: string // bot name or player username
  result: GameResult
  timeControl: TimeControlType
  playerColor: 'white' | 'black'
  moveCount: number
}

// Online match types
export interface OnlinePlayer {
  username: string
  avatar: string
  ready: boolean
}

export interface PrivateLobby {
  code: string
  host: OnlinePlayer
  guest?: OnlinePlayer
}

// Move quality types for analysis
export type MoveQuality = 'best' | 'great' | 'good' | 'inaccuracy' | 'mistake' | 'blunder'

export interface MoveAnalysis {
  moveNumber: number
  move: string
  quality: MoveQuality
  evaluation: number // in centipawns
}

export interface GameAnalysis {
  playerAccuracy: number
  opponentAccuracy: number
  moves: MoveAnalysis[]
}

// Player avatars
export const AVATARS = ['👤', '🧑', '👨', '👩', '🧔', '👨‍🦰', '👩‍🦰', '👨‍🦱', '👩‍🦱', '🤴', '👸', '🧙', '🦸', '🥷', '🤠']
