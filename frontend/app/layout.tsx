import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthProvider, useAuth } from "@/lib/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export const metadata = {
  title: "Data Science Knowledge Hub",
  description: "Personal knowledge hub for Data Science resources and projects",
  generator: "v0.dev",
}

function ProtectedApp({ children }: { children: React.ReactNode }) {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ProtectedApp>
              <DashboardLayout>{children}</DashboardLayout>
            </ProtectedApp>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
