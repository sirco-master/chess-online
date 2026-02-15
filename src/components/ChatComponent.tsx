import { useState, useEffect, useRef } from 'react'
import './ChatComponent.css'

interface ChatMessage {
  username: string
  message: string
  timestamp: number
  isOwn?: boolean
}

interface ChatComponentProps {
  onSendMessage: (message: string) => void
  messages: ChatMessage[]
  collapsed?: boolean
  onToggle?: () => void
}

function ChatComponent({ onSendMessage, messages, collapsed = false, onToggle }: ChatComponentProps) {
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim())
      setInputMessage('')
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (collapsed) {
    return (
      <div className="chat-component collapsed">
        <button className="chat-toggle" onClick={onToggle}>
          💬 Chat ({messages.length})
        </button>
      </div>
    )
  }

  return (
    <div className="chat-component">
      <div className="chat-header">
        <span className="chat-title">💬 Chat</span>
        {onToggle && (
          <button className="chat-collapse-btn" onClick={onToggle}>
            ✕
          </button>
        )}
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">No messages yet...</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.isOwn ? 'own' : 'other'}`}
            >
              <div className="message-header">
                <span className="message-username">{msg.username}</span>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="message-text">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          maxLength={200}
        />
        <button type="submit" className="chat-send-btn" disabled={!inputMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatComponent
