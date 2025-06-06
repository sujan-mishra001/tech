"use client"

import { useState, FormEvent, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(formData.email, formData.password)
      toast({ 
        title: "Login successful",
        description: "Welcome back! Redirecting you to the homepage..." 
      })
      router.push("/")
    } catch (err: any) {
      toast({ 
        title: "Login failed", 
        description: err.message || "Invalid credentials", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <Input 
          type="email" 
          name="email"
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange}
          required 
        />
        <Input 
          type="password" 
          name="password"
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange}
          required 
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        <div className="text-center text-sm mt-2">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
        </div>
      </form>
    </div>
  )
}
