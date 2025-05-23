"use client"

import { useState, FormEvent, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await registerUser(formData)
      if (res.success && res.user?.token) {
        localStorage.setItem("token", res.user.token)
        localStorage.setItem("user", JSON.stringify(res.user))
        toast({ 
          title: "Registration successful",
          description: "Welcome! Redirecting you to the homepage..." 
        })
        await new Promise(resolve => setTimeout(resolve, 1000)) // Small delay for UX
        router.push("/")
        router.refresh()
      } else {
        toast({ 
          title: "Registration failed", 
          description: res.error || "Could not register", 
          variant: "destructive" 
        })
      }
    } catch (err: any) {
      toast({ 
        title: "Registration failed", 
        description: err.response?.data?.error || "Could not register", 
        variant: "destructive" 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <Input 
          type="text" 
          name="username"
          placeholder="Username" 
          value={formData.username} 
          onChange={handleChange}
          required 
        />
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
          {loading ? "Registering..." : "Register"}
        </Button>
        <div className="text-center text-sm mt-2">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </form>
    </div>
  )
}
