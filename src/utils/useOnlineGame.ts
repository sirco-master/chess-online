import { useEffect, useRef, useState } from 'react'
import wsClient from './websocket'

interface UseOnlineGameProps {
  gameId: string
  playerColor: 'white' | 'black'
  onOpponentMove: (move: string, fen: string, timeLeft: { white: number; black: number }) => void
  onOpponentResigned: () => void
  onOpponentDisconnected: () => void
  onGameOver: (result: any) => void
}

export function useOnlineGame({
  gameId,
  onOpponentMove,
  onOpponentResigned,
  onOpponentDisconnected,
  onGameOver
}: UseOnlineGameProps) {
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const setupRef = useRef(false)

  useEffect(() => {
    if (setupRef.current) return
    setupRef.current = true

    // Setup WebSocket listeners
    wsClient.onMove((data) => {
      onOpponentMove(data.move, data.fen, data.timeLeft)
    })

    wsClient.onOpponentResigned(() => {
      onOpponentResigned()
    })

    wsClient.onOpponentDisconnected(() => {
      onOpponentDisconnected()
    })

    wsClient.onGameOver((result) => {
      onGameOver(result)
    })

    wsClient.onChatMessage((data) => {
      setChatMessages((prev) => [
        ...prev,
        {
          username: data.username,
          message: data.message,
          timestamp: data.timestamp,
          isOwn: false
        }
      ])
    })

    return () => {
      // Cleanup listeners when component unmounts
      wsClient.removeAllListeners()
    }
  }, [gameId])

  const sendMove = (move: string, fen: string, timeLeft: { white: number; black: number }) => {
    wsClient.sendMove(gameId, move, fen, timeLeft)
  }

  const sendChatMessage = (message: string) => {
    const username = localStorage.getItem('online_username') || 'Player'
    wsClient.sendChatMessage(gameId, message)
    
    // Add to local messages immediately
    setChatMessages((prev) => [
      ...prev,
      {
        username,
        message,
        timestamp: Date.now(),
        isOwn: true
      }
    ])
  }

  const resignGame = () => {
    wsClient.resignGame(gameId)
  }

  const sendGameOver = (result: any) => {
    wsClient.sendGameOver(gameId, result)
  }

  return {
    sendMove,
    sendChatMessage,
    resignGame,
    sendGameOver,
    chatMessages
  }
}
