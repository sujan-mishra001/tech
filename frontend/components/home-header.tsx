"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Code, Database, BookOpen, FolderKanban, FileType2 } from "lucide-react"

export function HomeHeader() {
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  return (
    <Card className="border-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-background">
                <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Profile" />
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{greeting}!</h1>
                <p className="text-muted-foreground">Welcome to your Data Science Knowledge Hub</p>
              </div>
            </div>
            <p className="max-w-2xl">
              Organize and access your data science resources, code snippets, datasets, and projects in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/upload">
                <FileText className="h-4 w-4" />
                <span>Add Content</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/projects">
                <FolderKanban className="h-4 w-4" />
                <span>View Projects</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          <QuickLink href="/blogs" icon={FileText} label="Blogs" count={12} />
          <QuickLink href="/snippets" icon={Code} label="Code Snippets" count={24} />
          <QuickLink href="/datasets" icon={Database} label="Datasets" count={8} />
          <QuickLink href="/files" icon={FileType2} label="Files" count={15} />
          <QuickLink href="/books" icon={BookOpen} label="Books" count={6} />
          <QuickLink href="/projects" icon={FolderKanban} label="Projects" count={10} />
        </div>
      </CardContent>
    </Card>
  )
}

function QuickLink({
  href,
  icon: Icon,
  label,
  count,
}: {
  href: string
  icon: React.ElementType
  label: string
  count: number
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center rounded-lg bg-background p-3 text-center shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="mb-1 h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{count} items</span>
    </Link>
  )
}
