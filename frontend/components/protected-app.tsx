"use client"
import { useAuth } from "@/lib/auth-provider"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedApp({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    if (!loading && !user && pathname !== "/login" && pathname !== "/register") {
      router.replace("/login")
    }
  }, [user, loading, pathname, router])
  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  return <>{children}</>
}
