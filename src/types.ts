// Core game types
export type Screen = 'home' | 'mode-selection' | 'game' | 'game-log' | 'online-setup' | 'online-lobby' | 'profile' | 'bot-selection' | 'game-mode-selection'
export type GameMode = 'single-player' | '2-player' | 'online-public' | 'online-private' | 'personality-bot' | 'engine-bot'
export type Difficulty = 'practice' | 'beginner' | 'easy' | 'intermediate' | 'moderate' | 'tough' | 'hard' | 'insane' | 'extreme' | 'impossible'
export type PlayMode = 'normal' | 'friendly' // Normal = no hints/takebacks, medals. Friendly = unlimited hints/takebacks, no medals

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

// Bot types
export type BotCategory = 'beginner' | 'intermediate' | 'master' | 'champion' | 'historical' | 'rzplay-staff' | 'engine'

export interface PersonalityBot {
  id: string
  name: string
  category: BotCategory
  personality: string
  description: string
  elo: number
  avatar: string // SVG placeholder or emoji
}

export interface EngineBot {
  id: string
  elo: number
  avatar: string // SVG placeholder
}

// Beginner Category (ELO 200-500)
const BEGINNER_BOTS: PersonalityBot[] = [
  {
    id: 'beginner-1',
    name: 'Rookie Riley',
    category: 'beginner',
    personality: 'Learning the Basics',
    description: 'Just started learning chess. Still figuring out how the pieces move!',
    elo: 200,
    avatar: '🐣'
  },
  {
    id: 'beginner-2',
    name: 'Timid Tony',
    category: 'beginner',
    personality: 'Cautious Beginner',
    description: 'Plays it safe, sometimes too safe. Loves keeping pieces on the board.',
    elo: 250,
    avatar: '🐢'
  },
  {
    id: 'beginner-3',
    name: 'Curious Clara',
    category: 'beginner',
    personality: 'Exploring Moves',
    description: 'Experiments with different moves. Learning from every game!',
    elo: 300,
    avatar: '🦋'
  },
  {
    id: 'beginner-4',
    name: 'Eager Eddie',
    category: 'beginner',
    personality: 'Enthusiastic Novice',
    description: 'Full of energy and excitement. Loves making quick moves!',
    elo: 350,
    avatar: '🐶'
  },
  {
    id: 'beginner-5',
    name: 'Careful Carla',
    category: 'beginner',
    personality: 'Thoughtful Learner',
    description: 'Takes time to think. Starting to understand basic tactics.',
    elo: 400,
    avatar: '🦉'
  },
  {
    id: 'beginner-6',
    name: 'Bright Betty',
    category: 'beginner',
    personality: 'Quick Learner',
    description: 'Picks up patterns fast. Already mastering basic openings!',
    elo: 500,
    avatar: '⭐'
  }
]

// Intermediate Category (ELO 600-1000)
const INTERMEDIATE_BOTS: PersonalityBot[] = [
  {
    id: 'intermediate-1',
    name: 'Tactical Tim',
    category: 'intermediate',
    personality: 'Tactical Player',
    description: 'Loves forks, pins, and skewers. Always looking for tactical shots!',
    elo: 600,
    avatar: '🎯'
  },
  {
    id: 'intermediate-2',
    name: 'Steady Steve',
    category: 'intermediate',
    personality: 'Solid Player',
    description: 'Focuses on solid moves and good development. Rarely makes mistakes.',
    elo: 700,
    avatar: '🛡️'
  },
  {
    id: 'intermediate-3',
    name: 'Aggressive Anna',
    category: 'intermediate',
    personality: 'Attacking Player',
    description: 'Attacks from the opening. Loves creating threats against the king!',
    elo: 800,
    avatar: '⚔️'
  },
  {
    id: 'intermediate-4',
    name: 'Positional Paul',
    category: 'intermediate',
    personality: 'Positional Thinker',
    description: 'Improves piece placement slowly. Believes in long-term advantages.',
    elo: 850,
    avatar: '♟️'
  },
  {
    id: 'intermediate-5',
    name: 'Dynamic Diana',
    category: 'intermediate',
    personality: 'Flexible Player',
    description: 'Adapts to any position. Can play both tactical and positional chess.',
    elo: 900,
    avatar: '🌟'
  },
  {
    id: 'intermediate-6',
    name: 'Strategic Sam',
    category: 'intermediate',
    personality: 'Strategic Mind',
    description: 'Plans several moves ahead. Starting to understand complex strategies.',
    elo: 1000,
    avatar: '🧠'
  }
]

// Master Category (ELO 1200-1600)
const MASTER_BOTS: PersonalityBot[] = [
  {
    id: 'master-1',
    name: 'Opening Oliver',
    category: 'master',
    personality: 'Opening Expert',
    description: 'Knows all the main opening lines. Gets a great position from the start.',
    elo: 1200,
    avatar: '📚'
  },
  {
    id: 'master-2',
    name: 'Middlegame Mike',
    category: 'master',
    personality: 'Middlegame Specialist',
    description: 'Shines in complex middlegame positions. Masterful piece coordination.',
    elo: 1300,
    avatar: '♗'
  },
  {
    id: 'master-3',
    name: 'Endgame Emma',
    category: 'master',
    personality: 'Endgame Virtuoso',
    description: 'Precise in the endgame. Knows all the important theoretical positions.',
    elo: 1400,
    avatar: '♚'
  },
  {
    id: 'master-4',
    name: 'Calculating Carl',
    category: 'master',
    personality: 'Calculator',
    description: 'Calculates variations deeply. Rarely misses tactical opportunities.',
    elo: 1500,
    avatar: '🔢'
  },
  {
    id: 'master-5',
    name: 'Intuitive Iris',
    category: 'master',
    personality: 'Intuitive Player',
    description: 'Relies on intuition and pattern recognition. Finds moves by feel.',
    elo: 1550,
    avatar: '🎨'
  },
  {
    id: 'master-6',
    name: 'Balanced Boris',
    category: 'master',
    personality: 'Well-Rounded Master',
    description: 'Strong in all phases. No weaknesses in their game.',
    elo: 1600,
    avatar: '⚖️'
  }
]

// Champion Category (ELO 1800-2200)
const CHAMPION_BOTS: PersonalityBot[] = [
  {
    id: 'champion-1',
    name: 'Grandmaster Grace',
    category: 'champion',
    personality: 'Classical Champion',
    description: 'Plays the classics beautifully. Deep understanding of chess principles.',
    elo: 1800,
    avatar: '👑'
  },
  {
    id: 'champion-2',
    name: 'Blitz Barry',
    category: 'champion',
    personality: 'Speed Demon',
    description: 'Thinks fast and plays faster. Thrives under time pressure.',
    elo: 1900,
    avatar: '⚡'
  },
  {
    id: 'champion-3',
    name: 'Tactical Tina',
    category: 'champion',
    personality: 'Tactical Genius',
    description: 'Sees tactics others miss. Creates complications out of nothing.',
    elo: 2000,
    avatar: '🔍'
  },
  {
    id: 'champion-4',
    name: 'Positional Peter',
    category: 'champion',
    personality: 'Positional Master',
    description: 'Squeezes wins from drawn positions. Masterful technique.',
    elo: 2100,
    avatar: '🎭'
  },
  {
    id: 'champion-5',
    name: 'Creative Carmen',
    category: 'champion',
    personality: 'Creative Genius',
    description: 'Plays moves no one expects. Always finding new ideas.',
    elo: 2150,
    avatar: '💡'
  },
  {
    id: 'champion-6',
    name: 'Universal Uma',
    category: 'champion',
    personality: 'Complete Player',
    description: 'No style preference. Adapts perfectly to any position.',
    elo: 2200,
    avatar: '🌍'
  }
]

// Historical Category (ELO 1400-2400)
const HISTORICAL_BOTS: PersonalityBot[] = [
  {
    id: 'historical-1',
    name: 'Morphy',
    category: 'historical',
    personality: 'Romantic Attacker',
    description: 'Named after Paul Morphy. Brilliant tactics and aggressive play!',
    elo: 1400,
    avatar: '🎩'
  },
  {
    id: 'historical-2',
    name: 'Steinitz',
    category: 'historical',
    personality: 'Father of Positional Chess',
    description: 'Inspired by Wilhelm Steinitz. Solid, scientific approach.',
    elo: 1600,
    avatar: '🔬'
  },
  {
    id: 'historical-3',
    name: 'Capablanca',
    category: 'historical',
    personality: 'Endgame Machine',
    description: 'Like José Capablanca. Simple, clear, and deadly in endgames.',
    elo: 1900,
    avatar: '🎓'
  },
  {
    id: 'historical-4',
    name: 'Alekhine',
    category: 'historical',
    personality: 'Attacking Genius',
    description: 'After Alexander Alekhine. Complex, dynamic, aggressive.',
    elo: 2100,
    avatar: '🦅'
  },
  {
    id: 'historical-5',
    name: 'Tal',
    category: 'historical',
    personality: 'Magician',
    description: 'Mikhail Tal style. Sacrifices and complications everywhere!',
    elo: 2200,
    avatar: '🪄'
  },
  {
    id: 'historical-6',
    name: 'Fischer',
    category: 'historical',
    personality: 'The Greatest',
    description: 'Bobby Fischer inspired. Precise, powerful, and perfect.',
    elo: 2400,
    avatar: '👨‍🚀'
  }
]

// RzPlay Staff Category
const RZPLAY_STAFF_BOTS: PersonalityBot[] = [
  {
    id: 'staff-futi',
    name: 'Futi',
    category: 'rzplay-staff',
    personality: 'The Newbie',
    description: 'Completely clueless! Makes silly moves and has fun losing.',
    elo: 250,
    avatar: '🤪'
  },
  {
    id: 'staff-zero',
    name: 'Zero',
    category: 'rzplay-staff',
    personality: 'The Beginner',
    description: 'Brand new to chess. Just pushes pawns and hopes for the best!',
    elo: 550,
    avatar: '0️⃣'
  },
  {
    id: 'staff-silly',
    name: 'Silly',
    category: 'rzplay-staff',
    personality: 'Rooks & Queens Only',
    description: 'Obsessed with rooks and queens. Avoids bishops and knights like the plague!',
    elo: 800,
    avatar: '🃏'
  },
  {
    id: 'staff-glitch',
    name: 'Glitch',
    category: 'rzplay-staff',
    personality: 'The Quirky One',
    description: 'Loves knights, queens, and pawns. Has a thing for Scholar\'s Mate!',
    elo: 1000,
    avatar: '⚙️'
  },
  {
    id: 'staff-agent',
    name: 'Agent',
    category: 'rzplay-staff',
    personality: 'The Smart One',
    description: 'Strategic and smart with queens, bishops, and knights. Weak with pawns and rooks.',
    elo: 1700,
    avatar: '🕵️'
  },
  {
    id: 'staff-team',
    name: 'Team Effort',
    category: 'rzplay-staff',
    personality: 'Combined Forces',
    description: '👥 The hardest challenge! Combines all staff strategies into one.',
    elo: 2600,
    avatar: '👥'
  }
]

// Engine Bots (14 bots, ELO 150-3200)
export const ENGINE_BOTS: EngineBot[] = [
  { id: 'engine-150', elo: 150, avatar: '🤖' },
  { id: 'engine-400', elo: 400, avatar: '🤖' },
  { id: 'engine-600', elo: 600, avatar: '🤖' },
  { id: 'engine-800', elo: 800, avatar: '🤖' },
  { id: 'engine-1000', elo: 1000, avatar: '🤖' },
  { id: 'engine-1200', elo: 1200, avatar: '🤖' },
  { id: 'engine-1400', elo: 1400, avatar: '🤖' },
  { id: 'engine-1600', elo: 1600, avatar: '🤖' },
  { id: 'engine-1800', elo: 1800, avatar: '🤖' },
  { id: 'engine-2000', elo: 2000, avatar: '🤖' },
  { id: 'engine-2200', elo: 2200, avatar: '🤖' },
  { id: 'engine-2500', elo: 2500, avatar: '🤖' },
  { id: 'engine-2800', elo: 2800, avatar: '🤖' },
  { id: 'engine-3200', elo: 3200, avatar: '🤖' }
]

// All personality bots combined
export const PERSONALITY_BOTS: PersonalityBot[] = [
  ...BEGINNER_BOTS,
  ...INTERMEDIATE_BOTS,
  ...MASTER_BOTS,
  ...CHAMPION_BOTS,
  ...HISTORICAL_BOTS,
  ...RZPLAY_STAFF_BOTS
]

// Organized by category
export const PERSONALITY_BOTS_BY_CATEGORY: Record<BotCategory, PersonalityBot[]> = {
  'beginner': BEGINNER_BOTS,
  'intermediate': INTERMEDIATE_BOTS,
  'master': MASTER_BOTS,
  'champion': CHAMPION_BOTS,
  'historical': HISTORICAL_BOTS,
  'rzplay-staff': RZPLAY_STAFF_BOTS,
  'engine': [] // Engine bots are separate
}

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
  elo?: number
  medals?: number
  bio?: string
}

export interface PrivateLobby {
  code: string
  host: OnlinePlayer
  guest?: OnlinePlayer
}

// Profile types
export interface UserProfile {
  username: string
  avatar: string
  bio: string
  elo: number
  beatenBots: string[] // Array of bot IDs that have been beaten in Normal mode
}

// Medal types
export interface MedalProgress {
  totalMedals: number
  personalityMedals: number // 36 max
  engineMedals: number // 14 max
  beatenBots: string[] // IDs of bots beaten in Normal mode
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
