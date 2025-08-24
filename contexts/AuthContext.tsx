'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  authToken: string | null
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
  sessionId: string | null
  setSessionId: (id: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token on mount
    const token = localStorage.getItem('athena_auth_token')
    if (token) {
      setAuthToken(token)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (token: string) => {
    localStorage.setItem('athena_auth_token', token)
    setAuthToken(token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('athena_auth_token')
    setAuthToken(null)
    setIsAuthenticated(false)
    setSessionId(null)
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      authToken,
      isLoading,
      login,
      logout,
      sessionId,
      setSessionId
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
