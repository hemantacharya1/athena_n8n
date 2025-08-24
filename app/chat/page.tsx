'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { SidebarHistory } from '@/components/chat/SidebarHistory'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X } from 'lucide-react'
import { getChatHistory, getSessionMessages, ChatSession, ChatMessage } from '@/lib/api'
import Link from 'next/link'

export default function ChatPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, logout, sessionId, setSessionId } = useAuth()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return
    
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Only load chat history once when authenticated
    const loadHistory = async () => {
      await loadChatHistory()
    }
    loadHistory()
  }, [isAuthenticated, isLoading, router])

  const loadChatHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true)
      const history = await getChatHistory()
      console.log('Chat Page - Loaded History:', history) // Debug log
      setSessions(history)
    } catch (error) {
      console.error('Error loading chat history:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  const handleSessionSelect = async (sessionId: string) => {
    setSessionId(sessionId)
    setIsSidebarOpen(false) // Close sidebar on mobile
  }

  const handleNewChat = () => {
    const newSessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setSessionId(newSessionId)
    setIsSidebarOpen(false) // Close sidebar
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="typing-indicator">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  return (
    <div className="h-screen flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isSidebarOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`${isSidebarOpen ? 'w-80' : 'w-0'} lg:relative z-50 h-full overflow-hidden`}
      >
        <div className="w-80 h-full">
          <SidebarHistory
            sessions={sessions}
            currentSessionId={sessionId}
            onSessionSelect={handleSessionSelect}
            onNewChat={handleNewChat}
            isLoading={isLoadingHistory}
          />
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect border-b border-white/20 p-4 flex items-center justify-between"
        >
                     <div className="flex items-center gap-4">
             <Button
               variant="glass"
               size="icon"
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             >
               {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
             </Button>
            
            <div>
              <h1 className="text-xl font-semibold text-white">Athena</h1>
              <p className="text-sm text-gray-400">Your Personal AI Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="glass" size="sm">
                Home
              </Button>
            </Link>
            <Button
              variant="glass"
              size="icon"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </motion.header>

        {/* Chat Window */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            sessionId={sessionId}
            onSessionIdChange={setSessionId}
          />
        </div>
      </div>
    </div>
  )
}
