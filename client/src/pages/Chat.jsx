import { useState, useRef, useEffect } from 'react'
import { useMood } from '../context/MoodContext'
import api from '../services/api'

const SUGGESTIONS = [
  'How are you feeling today?',
  'I need help planning my day',
  'I feel overwhelmed',
  'Can we do a breathing exercise?'
]

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I am here to support you. How are you feeling today?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)
  const { updateMood, isDistressed } = useMood()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
  const userMessage = text || input.trim()
  if (!userMessage || loading) return

  setInput('')
  setMessages(prev => [...prev, { role: 'user', content: userMessage }])
  setLoading(true)

  try {
    const res = await api.post('/chat/message', {
      message: userMessage,
      sessionId
    })

    setSessionId(res.data.sessionId)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: res.data.reply
    }])

    // Sentiment backend'den geliyor, dil bağımsız
    if (res.data.sentiment) {
      updateMood({
        score: res.data.sentiment.score,
        mood: res.data.sentiment.mood
      })
    }
  } catch (err) {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'Sorry, something went wrong. Please try again.'
    }])
  } finally {
    setLoading(false)
  }
}

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col h-screen p-4">

        <div className="flex items-center gap-3 mb-4 pt-2">
          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-lg">
            🤗
          </div>
          <div>
            <h1 className="text-base font-medium text-purple-800">Support Assistant</h1>
            <p className="text-xs text-gray-400">Always here for you</p>
          </div>
        </div>

        {isDistressed && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 mb-4 text-sm text-blue-700">
            It seems you might be going through a tough time. Would you like to try a breathing exercise?
          </div>
        )}

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-700 shadow-sm rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl shadow-sm rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 flex-wrap mb-3">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="text-xs bg-white border border-purple-200 text-purple-600 px-3 py-1.5 rounded-full hover:bg-purple-50 transition"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 resize-none"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="bg-purple-600 text-white px-4 py-3 rounded-2xl text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}