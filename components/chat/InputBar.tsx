'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AudioRecorder } from './AudioRecorder'
import { cn } from '@/lib/utils'

interface InputBarProps {
  onSendMessage: (message: string) => void
  onSendVoice: (audioBlob: Blob) => void
  disabled?: boolean
  placeholder?: string
}

export function InputBar({ 
  onSendMessage, 
  onSendVoice, 
  disabled = false,
  placeholder = "Type your message..." 
}: InputBarProps) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleVoiceRecording = (audioBlob: Blob) => {
    onSendVoice(audioBlob)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    setIsTyping(e.target.value.length > 0)
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-4 border border-white/20"
    >
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none"
            rows={1}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <AudioRecorder
            onRecordingComplete={handleVoiceRecording}
            disabled={disabled}
          />
          
          <Button
            variant="neon"
            size="icon"
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            className={cn(
              "transition-all duration-200",
              isTyping && "animate-pulse-glow"
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
