"use client"
import { useAuth } from "@/lib/auth-provider"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const PUBLIC_PATHS = ['/login', '/register']

export default function ProtectedApp({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      const isPublicPath = PUBLIC_PATHS.includes(pathname)
      
      if (!user && !isPublicPath) {
        // Not logged in and trying to access protected route
        router.replace('/login')
      } else if (user && isPublicPath) {
        // Already logged in and trying to access login/register
        router.replace('/')
      }
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return children
}
