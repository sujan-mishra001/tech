import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import ProtectedApp from "@/components/protected-app"
import Link from "next/link"
import { UserCircle, Settings, BookOpen, FileText, Code, Database, FolderKanban, FileType2 } from "lucide-react"

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
            <div className="flex min-h-screen">
              {/* Left vertical nav bar */}
              <aside className="w-20 bg-muted border-r flex flex-col items-center py-6 gap-4">
                <NavIcon href="/blogs" icon={<FileText />} label="Blogs" />
                <NavIcon href="/projects" icon={<FolderKanban />} label="Projects" />
                <NavIcon href="/snippets" icon={<Code />} label="Snippets" />
                <NavIcon href="/datasets" icon={<Database />} label="Datasets" />
                <NavIcon href="/files" icon={<FileType2 />} label="Files" />
                <NavIcon href="/books" icon={<BookOpen />} label="Books" />
              </aside>
              {/* Main content */}
              <main className="flex-1 flex flex-col min-h-screen">
                {/* Top bar with profile/settings */}
                <header className="w-full flex justify-end items-center px-6 py-4 border-b bg-background">
                  <div className="flex items-center gap-4">
                    {/* Profile avatar (placeholder) */}
                    <a href="/profile" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:ring-2 ring-primary transition-all cursor-pointer">
                      <UserCircle className="w-7 h-7 text-muted-foreground" />
                    </a>
                    {/* Settings button */}
                    <button className="p-2 rounded-full hover:bg-muted transition-colors">
                      <Settings className="w-6 h-6 text-muted-foreground" />
                    </button>
                  </div>
                </header>
                <div className="flex-1 p-0">{children}</div>
              </main>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

function NavIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 group py-2 w-full hover:bg-accent rounded transition-colors" title={label}>
      <span className="w-7 h-7 flex items-center justify-center text-muted-foreground group-hover:text-primary">{icon}</span>
      <span className="text-xs text-muted-foreground group-hover:text-primary">{label}</span>
    </Link>
  )
}
