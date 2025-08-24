'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { InputBar } from './InputBar'
import { ChatMessage, sendTextMessage, sendVoiceMessage, getSessionMessages } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { generateSessionId } from '@/lib/utils'
import { Bot } from 'lucide-react'

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
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Bot className="h-5 w-5 animate-spin" />
            <span>Athena is thinking...</span>
          </div>
        )}

        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-8 rounded-full bg-secondary/50 mb-4">
              <Bot className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Welcome to Athena</h2>
            <p className="text-muted-foreground max-w-sm">
              Your personal AI assistant is ready to help. Ask me anything or start a new chat.
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
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
