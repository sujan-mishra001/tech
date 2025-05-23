"use client"

import { createContext, useContext, type ReactNode } from "react"

type MongoDBContextType = {
  isConnected: boolean
}

const MongoDBContext = createContext<MongoDBContextType | undefined>(undefined)

export function MongoDBProvider({ children }: { children: ReactNode }) {
  // In a real app, this would connect to MongoDB Data API
  // For now, we'll just simulate a connection
  const isConnected = true

  return <MongoDBContext.Provider value={{ isConnected }}>{children}</MongoDBContext.Provider>
}

export function useMongoDBContext() {
  const context = useContext(MongoDBContext)
  if (context === undefined) {
    throw new Error("useMongoDBContext must be used within a MongoDBProvider")
  }
  return context
}
