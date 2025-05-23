"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { loginUser, registerUser, getCurrentUser, updateUserProfile, logoutUser } from './api'

type User = {
  _id: string
  username: string
  email: string
  role: string
  avatar: string
  darkMode: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        const data = await getCurrentUser()
        if (data.success && data.user) {
          setUser(data.user)
        } else {
          // If getCurrentUser fails, clear the token
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Clear token on error
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])
  const login = async (email: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      const data = await loginUser({ email, password })
      if (data.success && data.user) {
        setUser(data.user)
      } else {
        throw new Error(data.error || 'Login failed')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setError(null)
    try {
      const data = await registerUser({ username, email, password })
      if (data.success && data.user) {
        setUser(data.user)
      } else {
        throw new Error(data.error || 'Registration failed')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }
  const logout = async () => {
    try {
      await logoutUser()
      // Clear token and user state
      localStorage.removeItem('token')
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      localStorage.removeItem('token')
      setUser(null)
      window.location.href = '/login'
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    setError(null)
    try {
      const data = await updateUserProfile(userData)
      if (data.success && data.user) {
        setUser(prev => prev ? { ...prev, ...data.user } : data.user)
      } else {
        throw new Error(data.error || 'Profile update failed')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Profile update failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}