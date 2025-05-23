import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthProvider } from "@/lib/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata = {
  title: "Data Science Knowledge Hub",
  description: "Personal knowledge hub for Data Science resources and projects",
  generator: "v0.dev",
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
            <DashboardLayout>{children}</DashboardLayout>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
