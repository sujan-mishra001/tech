"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Code,
  Database,
  FileText,
  FolderKanban,
  Home,
  Search,
  Upload,
  Github,
  FileType2,
  X,
  Moon,
  Sun,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Blogs", href: "/blogs", icon: FileText },
  { name: "Code Snippets", href: "/snippets", icon: Code },
  { name: "Datasets", href: "/datasets", icon: Database },
  { name: "Files", href: "/files", icon: FileType2 },
  { name: "Books", href: "/books", icon: BookOpen },
  { name: "Projects", href: "/projects", icon: FolderKanban },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Data Science Hub</span>
                <span className="text-xs text-muted-foreground">Personal Knowledge Base</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>External</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="GitHub Projects">
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        <span>GitHub Projects</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Upload Content">
                  <Link href="/upload">
                    <Upload className="h-4 w-4" />
                    <span>Upload Content</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />

            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2">
                {isSearchOpen ? (
                  <div className="relative flex items-center">
                    <Input
                      type="search"
                      placeholder="Search content..."
                      className="h-9 w-[300px] md:w-[400px] pl-8"
                      autoFocus
                    />
                    <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 h-7 w-7 px-0"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close search</span>
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => setIsSearchOpen(true)}>
                    <Search className="h-4 w-4" />
                    <span className="hidden md:inline-flex">Search content...</span>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <User className="h-4 w-4" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                          <AvatarFallback>DS</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">Data Scientist</h3>
                          <p className="text-sm text-muted-foreground">Admin</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" asChild>
                          <Link href="/profile">Profile Settings</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/admin">Admin Dashboard</Link>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
