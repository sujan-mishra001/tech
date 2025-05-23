"use client"

import React, { createContext, useState, useContext, useEffect } from 'react'
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state from localStorage and verify with backend
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        
        if (token && savedUser) {
          // Set initial state from localStorage
          setUser(JSON.parse(savedUser))
          
          // Verify token with backend
          try {
            const data = await getCurrentUser()
            if (data.success && data.user) {
              // Update user data with latest from server
              const updatedUser = { ...JSON.parse(savedUser), ...data.user }
              setUser(updatedUser)
              localStorage.setItem('user', JSON.stringify(updatedUser))
            } else {
              // Invalid token or user data
              logout()
            }
          } catch (err) {
            // Network error or invalid token
            console.error('Error verifying auth:', err)
            logout()
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        logout()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      const data = await loginUser({ email, password })
      if (data.success && data.user) {
        // Save auth state
        setUser(data.user)
        localStorage.setItem('token', data.user.token!)
        localStorage.setItem('user', JSON.stringify(data.user))
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
        // Save auth state
        setUser(data.user)
        localStorage.setItem('token', data.user.token!)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        throw new Error(data.error || 'Registration failed')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const updateProfile = async (userData: Partial<User>) => {
    setError(null)
    try {
      const data = await updateUserProfile(userData)
      if (data.success && data.user) {
        const updatedUser = { ...user, ...data.user }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
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