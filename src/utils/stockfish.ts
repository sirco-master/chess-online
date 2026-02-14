import { Difficulty } from '../App'

export interface StockfishConfig {
  skill: number
  depth: number
  moveTime: number
}

export const difficultyConfigs: Record<Difficulty, StockfishConfig> = {
  practice: { skill: 0, depth: 1, moveTime: 100 },
  beginner: { skill: 1, depth: 2, moveTime: 200 },
  easy: { skill: 3, depth: 3, moveTime: 300 },
  intermediate: { skill: 5, depth: 5, moveTime: 500 },
  moderate: { skill: 8, depth: 8, moveTime: 800 },
  tough: { skill: 10, depth: 10, moveTime: 1000 },
  hard: { skill: 13, depth: 12, moveTime: 1200 },
  insane: { skill: 16, depth: 15, moveTime: 1500 },
  extreme: { skill: 18, depth: 18, moveTime: 2000 },
  impossible: { skill: 20, depth: 20, moveTime: 3000 },
}

class StockfishEngine {
  private worker: Worker | null = null
  private onMessageCallback: ((message: string) => void) | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.worker = new Worker('/stockfish.js')
        
        this.worker.onmessage = (e) => {
          const message = e.data
          if (this.onMessageCallback) {
            this.onMessageCallback(message)
          }
        }

        this.worker.onerror = (error) => {
          console.error('Stockfish worker error:', error)
          reject(error)
        }

        setTimeout(() => {
          this.send('uci')
          resolve()
        }, 100)
      } catch (error) {
        console.error('Failed to initialize Stockfish:', error)
        reject(error)
      }
    })
  }

  send(command: string): void {
    if (this.worker) {
      this.worker.postMessage(command)
    }
  }

  onMessage(callback: (message: string) => void): void {
    this.onMessageCallback = callback
  }

  async getBestMove(fen: string, config: StockfishConfig): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Stockfish not initialized'))
        return
      }

      let bestMove = ''
      const timeout = setTimeout(() => {
        if (!bestMove) {
          reject(new Error('Stockfish timeout'))
        }
      }, config.moveTime + 5000)

      const messageHandler = (message: string) => {
        if (message.startsWith('bestmove')) {
          const match = message.match(/bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/)
          if (match) {
            bestMove = match[1]
            clearTimeout(timeout)
            resolve(bestMove)
          }
        }
      }

      this.onMessage(messageHandler)
      
      this.send('ucinewgame')
      this.send(`setoption name Skill Level value ${config.skill}`)
      this.send(`position fen ${fen}`)
      this.send(`go depth ${config.depth} movetime ${config.moveTime}`)
    })
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
    }
  }
}

export default StockfishEngine
