'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Sparkles, Bot, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/chat')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-bg">
        <div className="floating-particles">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink flex items-center justify-center neon-glow">
              <Bot className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold mb-6 gradient-text"
          >
            Athena
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl text-white mb-8 font-light"
          >
            Your Personal AI Assistant
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Experience the future of AI interaction with Athena. Powered by advanced machine learning, 
            designed with a futuristic interface that makes every conversation feel magical.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="glass-effect rounded-2xl p-6 border border-white/20">
              <Zap className="w-8 h-8 text-neon-blue mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300 text-sm">Instant responses powered by cutting-edge AI</p>
            </div>
            <div className="glass-effect rounded-2xl p-6 border border-white/20">
              <Sparkles className="w-8 h-8 text-neon-purple mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Smart Conversations</h3>
              <p className="text-gray-300 text-sm">Context-aware discussions that feel natural</p>
            </div>
            <div className="glass-effect rounded-2xl p-6 border border-white/20">
              <Shield className="w-8 h-8 text-neon-green mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-300 text-sm">Your conversations are protected and private</p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="neon"
              size="lg"
              onClick={handleGetStarted}
              className="text-lg px-8 py-4"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Chat
            </Button>
            <Button
              variant="glass"
              size="lg"
              onClick={handleLogin}
              className="text-lg px-8 py-4"
            >
              Login
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-4 h-4 bg-neon-blue rounded-full opacity-60"
      />
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-20 w-6 h-6 bg-neon-purple rounded-full opacity-60"
      />
      <motion.div
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 left-1/4 w-3 h-3 bg-neon-pink rounded-full opacity-60"
      />
    </div>
  )
}
