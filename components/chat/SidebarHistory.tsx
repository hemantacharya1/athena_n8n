'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Plus, Clock, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatSession } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SidebarHistoryProps {
  sessions: ChatSession[]
  currentSessionId: string | null
  onSessionSelect: (sessionId: string) => void
  onNewChat: () => void
  isLoading?: boolean
}

export function SidebarHistory({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewChat,
  isLoading = false
}: SidebarHistoryProps) {
  console.log('SidebarHistory - Sessions:', sessions) // Debug log
  console.log('SidebarHistory - isLoading:', isLoading) // Debug log
  return (
    <div className="w-80 h-full glass-effect rounded-2xl p-4 border border-white/20">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-neon-blue" />
          Chat History
        </h2>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No chat history yet</p>
            <p className="text-sm">Start a new conversation!</p>
          </div>
        ) : (
          sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "glass-effect rounded-xl p-3 cursor-pointer transition-all duration-200 border",
                currentSessionId === session.id
                  ? "border-neon-blue bg-neon-blue/10"
                  : "border-white/10 hover:border-white/20 hover:bg-white/5"
              )}
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white truncate flex-1">
                  {session.title}
                </h3>
                <span className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded">
                  {session.messageCount}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 truncate mb-2">
                {session.lastMessage}
              </p>
              
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {formatDate(session.timestamp)}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 pt-4 border-t border-white/10"
        >
          <Button
            variant="outline"
            className="w-full glass-effect border-white/20 text-white hover:bg-white/10"
            onClick={onNewChat}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </motion.div>
      )}
    </div>
  )
}
