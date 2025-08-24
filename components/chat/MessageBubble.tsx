'use client'

import React from 'react'
import { User, Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn, formatDate } from '@/lib/utils'
import { ChatMessage } from '@/lib/api'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  const markdownComponents = {
    p: ({ children }: any) => <p className="mb-2 last:mb-0">{children}</p>,
    code: ({ children, className }: any) => (
      <code className={cn('bg-muted text-muted-foreground px-1 py-0.5 rounded text-sm', className)}>
        {children}
      </code>
    ),
    pre: ({ children }: any) => (
      <pre className="bg-muted text-muted-foreground p-3 rounded-lg overflow-x-auto my-2">
        {children}
      </pre>
    ),
    ul: ({ children }: any) => <ul className="list-disc list-inside my-2">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside my-2">{children}</ol>,
  }

  return (
    <div className={cn('flex items-start gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <Bot className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}

      <div className="flex flex-col items-end">
        <div
          className={cn(
            'max-w-md rounded-2xl p-3',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-secondary text-secondary-foreground rounded-bl-none'
          )}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDate(message.timestamp)}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
    </div>
  )
}
