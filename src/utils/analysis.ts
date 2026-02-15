import { Chess } from 'chess.js'
import StockfishEngine from './stockfish'
import { MoveQuality, MoveAnalysis, GameAnalysis } from '../types'

const ANALYSIS_DEPTH = 18
const ANALYSIS_TIME = 2000

export interface EngineEvaluation {
  score: number // centipawns (positive = white advantage)
  mate?: number // moves to mate if applicable
}

// Evaluate a position using Stockfish
export async function evaluatePosition(
  stockfish: StockfishEngine,
  fen: string
): Promise<EngineEvaluation> {
  return new Promise((resolve, reject) => {
    let evaluation: EngineEvaluation = { score: 0 }
    const timeout = setTimeout(() => {
      reject(new Error('Evaluation timeout'))
    }, ANALYSIS_TIME + 2000)

    const messageHandler = (message: string) => {
      // Parse score from UCI info lines
      if (message.includes('score cp')) {
        const match = message.match(/score cp (-?\d+)/)
        if (match) {
          evaluation.score = parseInt(match[1], 10)
        }
      } else if (message.includes('score mate')) {
        const match = message.match(/score mate (-?\d+)/)
        if (match) {
          evaluation.mate = parseInt(match[1], 10)
          evaluation.score = evaluation.mate > 0 ? 10000 : -10000
        }
      }
      
      if (message.startsWith('bestmove')) {
        clearTimeout(timeout)
        resolve(evaluation)
      }
    }

    stockfish.onMessage(messageHandler)
    stockfish.send('ucinewgame')
    stockfish.send(`position fen ${fen}`)
    stockfish.send(`go depth ${ANALYSIS_DEPTH} movetime ${ANALYSIS_TIME}`)
  })
}

// Classify move quality based on evaluation change
export function classifyMove(
  evalBefore: number,
  evalAfter: number,
  isWhiteMove: boolean
): MoveQuality {
  // Adjust for perspective (positive = advantage for side that just moved)
  const adjustedBefore = isWhiteMove ? evalBefore : -evalBefore
  const adjustedAfter = isWhiteMove ? -evalAfter : evalAfter // flip because it's opponent's turn now
  
  const evalChange = adjustedAfter - adjustedBefore
  
  // Thresholds in centipawns
  if (evalChange >= -10) return 'best'
  if (evalChange >= -30) return 'great'
  if (evalChange >= -60) return 'good'
  if (evalChange >= -150) return 'inaccuracy'
  if (evalChange >= -300) return 'mistake'
  return 'blunder'
}

// Analyze a completed game
export async function analyzeGame(
  stockfish: StockfishEngine,
  moves: string[], // array of moves in SAN notation
  progressCallback?: (progress: number) => void
): Promise<GameAnalysis> {
  const chess = new Chess()
  const analysis: MoveAnalysis[] = []
  
  let prevEval = 0 // Starting position is equal
  
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i]
    const moveObj = chess.move(move)
    
    if (!moveObj) {
      console.error('Invalid move in analysis:', move)
      continue
    }
    
    // Evaluate position after move
    const currentEval = await evaluatePosition(stockfish, chess.fen())
    
    // Classify the move
    const isWhiteMove = moveObj.color === 'w'
    const quality = classifyMove(prevEval, currentEval.score, isWhiteMove)
    
    analysis.push({
      moveNumber: Math.floor(i / 2) + 1,
      move: moveObj.san,
      quality,
      evaluation: currentEval.score
    })
    
    prevEval = currentEval.score
    
    if (progressCallback) {
      progressCallback(Math.round(((i + 1) / moves.length) * 100))
    }
  }
  
  // Calculate accuracy scores
  const whiteMoves = analysis.filter((_, i) => i % 2 === 0)
  const blackMoves = analysis.filter((_, i) => i % 2 === 1)
  
  const playerAccuracy = calculateAccuracy(whiteMoves)
  const opponentAccuracy = calculateAccuracy(blackMoves)
  
  return {
    playerAccuracy,
    opponentAccuracy,
    moves: analysis
  }
}

// Calculate accuracy percentage based on move quality
function calculateAccuracy(moves: MoveAnalysis[]): number {
  if (moves.length === 0) return 100
  
  const qualityScores: Record<MoveQuality, number> = {
    best: 100,
    great: 95,
    good: 85,
    inaccuracy: 70,
    mistake: 50,
    blunder: 25
  }
  
  const totalScore = moves.reduce((sum, move) => sum + qualityScores[move.quality], 0)
  return Math.round(totalScore / moves.length)
}

// Get color and label for move quality
export function getMoveQualityDisplay(quality: MoveQuality): { label: string; color: string } {
  const displays: Record<MoveQuality, { label: string; color: string }> = {
    best: { label: 'Best', color: '#4CAF50' },
    great: { label: 'Great', color: '#8BC34A' },
    good: { label: 'Good', color: '#CDDC39' },
    inaccuracy: { label: 'Inaccuracy', color: '#FFC107' },
    mistake: { label: 'Mistake', color: '#FF9800' },
    blunder: { label: 'Blunder', color: '#F44336' }
  }
  return displays[quality]
}
