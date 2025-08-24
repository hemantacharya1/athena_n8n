'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { SidebarHistory } from '@/components/chat/SidebarHistory'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X } from 'lucide-react'
import { getChatHistory, ChatSession } from '@/lib/api'
import Link from 'next/link'

export default function ChatPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, logout, sessionId, setSessionId } = useAuth()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const loadHistory = async () => {
      await loadChatHistory()
    }
    loadHistory()
  }, [isAuthenticated, isLoading, router])

  const loadChatHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true)
      const history = await getChatHistory()
      setSessions(history)
    } catch (error) {
      console.error('Error loading chat history:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  const handleSessionSelect = (sessionId: string) => {
    setSessionId(sessionId)
    if (window.innerWidth < 768) { // md breakpoint
      setIsSidebarOpen(false)
    }
  }

  const handleNewChat = () => {
    const newSessionId = `${Date.now()}`
    setSessionId(newSessionId)
    if (window.innerWidth < 768) { // md breakpoint
      setIsSidebarOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading your session...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirect is handled in useEffect
  }

  return (
    <div className="h-screen w-screen flex bg-background overflow-hidden">
      {/* Unified Sidebar */}
      <aside
        className={`h-full bg-background border-r border-border transition-all duration-300 ease-in-out z-40 overflow-hidden ${isSidebarOpen ? 'w-72' : 'w-0'}`}>
        <SidebarHistory
          sessions={sessions}
          currentSessionId={sessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          isLoading={isLoadingHistory}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b border-border bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Athena</h1>
              <p className="text-sm text-muted-foreground">Your Personal AI Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                Home
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <ChatWindow sessionId={sessionId ?? undefined} onSessionIdChange={setSessionId} />
        </div>
      </main>
    </div>
  )
}
