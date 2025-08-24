'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageBubble } from './MessageBubble'
import { InputBar } from './InputBar'
import { ChatMessage, sendTextMessage, sendVoiceMessage, getSessionMessages } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { generateSessionId } from '@/lib/utils'

interface ChatWindowProps {
  sessionId?: string
  onSessionIdChange?: (sessionId: string) => void
}

export function ChatWindow({ sessionId, onSessionIdChange }: ChatWindowProps) {
  const { authToken } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string>(sessionId || generateSessionId())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sessionId && sessionId !== currentSessionId) {
      setCurrentSessionId(sessionId)
      loadSessionMessages(sessionId)
    }
  }, [sessionId])

  const loadSessionMessages = async (sessionId: string) => {
    try {
      setIsLoading(true)
      const sessionMessages = await getSessionMessages(sessionId)
      setMessages(sessionMessages)
    } catch (error) {
      console.error('Error loading session messages:', error)
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    onSessionIdChange?.(currentSessionId)
  }, [currentSessionId, onSessionIdChange])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!authToken) {
      alert('Please login first')
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      sessionId: currentSessionId,
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await sendTextMessage(content, currentSessionId, authToken)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        sessionId: currentSessionId,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        sessionId: currentSessionId,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendVoice = async (audioBlob: Blob) => {
    if (!authToken) {
      alert('Please login first')
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: '🎤 Voice message',
      role: 'user',
      timestamp: new Date(),
      sessionId: currentSessionId,
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await sendVoiceMessage(audioBlob, currentSessionId, authToken)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        sessionId: currentSessionId,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending voice message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your voice message. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        sessionId: currentSessionId,
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center">
              <div className="w-5 h-5 text-white">🤖</div>
            </div>
            <div className="assistant-bubble">
              <div className="typing-indicator">
                <span className="text-white mr-2">Athena is thinking</span>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Welcome message for empty chat */}
        {messages.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="glass-effect rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Welcome to Athena</h3>
              <p className="text-gray-300 mb-4">
                Your personal AI assistant is ready to help. Ask me anything!
              </p>
              <div className="text-sm text-gray-400">
                💡 Try asking about coding, writing, or general knowledge
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6">
        <InputBar
          onSendMessage={handleSendMessage}
          onSendVoice={handleSendVoice}
          disabled={isLoading}
          placeholder="Ask Athena anything..."
        />
      </div>
    </div>
  )
}
