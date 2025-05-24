"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Code, Database, FileType2, BookOpen, FolderKanban } from "lucide-react"
import { getContentStats } from "@/lib/api"

type ContentStats = {
  blogs: number
  snippets: number
  datasets: number
  files: number
  books: number
  projects: number
  total: number
}

export function ContentStats() {
  const [stats, setStats] = useState<ContentStats>({
    blogs: 0,
    snippets: 0,
    datasets: 0,
    files: 0,
    books: 0,
    projects: 0,
    total: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getContentStats()
        const statsData = data as Omit<ContentStats, 'total'>
        setStats({
          ...statsData,
          total: Object.values(statsData).reduce((sum, count) => sum + (typeof count === 'number' ? count : 0), 0)
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Content Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <StatItem icon={FileText} label="Blogs" count={stats.blogs} loading={loading} />
          <StatItem icon={Code} label="Code Snippets" count={stats.snippets} loading={loading} />
          <StatItem icon={Database} label="Datasets" count={stats.datasets} loading={loading} />
          <StatItem icon={FileType2} label="Files" count={stats.files} loading={loading} />
          <StatItem icon={BookOpen} label="Books" count={stats.books} loading={loading} />
          <StatItem icon={FolderKanban} label="Projects" count={stats.projects} loading={loading} />
          <div className="mt-4 pt-4 border-t">
            <StatItem icon={() => null} label="Total Items" count={stats.total} loading={loading} bold />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatItem({
  icon: Icon,
  label,
  count,
  loading,
  bold = false,
}: {
  icon: React.ElementType
  label: string
  count: number
  loading: boolean
  bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon !== (() => null) && <Icon className="h-4 w-4 text-muted-foreground" />}
        <span className={`text-sm ${bold ? "font-medium" : ""}`}>{label}</span>
      </div>
      {loading ? (
        <div className="h-4 w-8 animate-pulse rounded bg-muted" />
      ) : (
        <span className={`text-sm ${bold ? "font-medium" : ""}`}>{count}</span>
      )}
    </div>
  )
}
