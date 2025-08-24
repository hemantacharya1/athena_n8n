'use client'

import React from 'react'
import { MessageSquare, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatSession } from '@/lib/api'
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
  return (
    <div className="flex flex-col h-full bg-background text-foreground p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat History
        </h2>
        <Button variant="ghost" size="icon" onClick={onNewChat}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto -mx-4 px-4 space-y-1">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Loading history...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 px-4">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-semibold">No history yet</p>
            <p className="text-sm">Start a new chat to begin.</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "rounded-lg p-3 cursor-pointer transition-colors",
                currentSessionId === session.id
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-secondary/50"
              )}
              onClick={() => onSessionSelect(session.id)}
            >
              <h3 className="font-medium truncate text-sm mb-1">{session.title}</h3>
              <p className="text-xs text-muted-foreground truncate">{session.lastMessage}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
