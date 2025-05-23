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
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        
        if (token && savedUser) {
          const data = await getCurrentUser()
          if (data.success) {
            setUser({
              ...JSON.parse(savedUser),
              ...data.user
            })
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const register = async (username: string, email: string, password: string) => {
    setError(null)
    try {
      const data = await registerUser({ username, email, password })
      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem('token', data.user.token!)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
      throw err
    }
  }

  const login = async (email: string, password: string) => {
    setError(null)
    try {
      const data = await loginUser({ email, password })
      if (data.success && data.user) {
        setUser(data.user)
        localStorage.setItem('token', data.user.token!)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed')
      throw err
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
        setUser(prev => prev ? { ...prev, ...data.user } : data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        setError(data.error || 'Profile update failed')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Profile update failed')
      throw err
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