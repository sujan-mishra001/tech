"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { loginUser, registerUser, getCurrentUser, updateUserProfile } from './api'

type User = {
  _id: string
  username: string
  email: string
  role: string
  avatar: string
  darkMode: boolean
  token?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const data = await getCurrentUser()
          setUser(data.user)
        }
      } catch (error) {
        localStorage.removeItem('token')
        console.error('Authentication error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await loginUser({ email, password })
      setUser(data.user)
      localStorage.setItem('token', data.user.token)
    } catch (err: any) {
      setError(err.message || 'Failed to login')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await registerUser({ username, email, password })
      setUser(data.user)
      localStorage.setItem('token', data.user.token)
    } catch (err: any) {
      setError(err.message || 'Failed to register')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateProfile = async (userData: Partial<User>) => {
    setLoading(true)
    setError(null)
    try {
      const data = await updateUserProfile(userData)
      setUser(data.user)
      if (data.user.token) {
        localStorage.setItem('token', data.user.token)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile }}>
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