'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, User, Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn, formatDate } from '@/lib/utils'
import { ChatMessage } from '@/lib/api'

interface MessageBubbleProps {
  message: ChatMessage
  isLast?: boolean
}

export function MessageBubble({ message, isLast = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={cn(
        'chat-bubble',
        isUser ? 'user-bubble' : 'assistant-bubble'
      )}>
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            {isUser ? (
              <p className="text-white">{message.content}</p>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  className="text-white"
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    code: ({ children, className }) => (
                      <code className={cn(
                        'bg-black/30 px-1 py-0.5 rounded text-sm',
                        className
                      )}>
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-black/30 p-3 rounded-lg overflow-x-auto mb-2">
                        {children}
                      </pre>
                    ),
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          
          {!isUser && (
            <button className="flex-shrink-0 w-6 h-6 rounded-full bg-neon-blue/20 hover:bg-neon-blue/30 flex items-center justify-center transition-colors">
              <Play className="w-3 h-3 text-neon-blue" />
            </button>
          )}
        </div>
        
                      <div className="text-xs text-gray-400 mt-2">
                {formatDate(message.timestamp)}
              </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  )
}
