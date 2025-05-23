"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Code, Database, FileType2, BookOpen, FolderKanban, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { getBlogs, getSnippets, getDatasets, getFiles, getBooks, getProjects } from "@/lib/api"

type ContentItem = {
  _id: string
  title: string
  description: string
  type: "blog" | "snippet" | "dataset" | "file" | "book" | "project"
  tags: string[]
  createdAt: string
  featured?: boolean
}

const typeIcons = {
  blog: FileText,
  snippet: Code,
  dataset: Database,
  file: FileType2,
  book: BookOpen,
  project: FolderKanban,
}

const typeColors = {
  blog: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  snippet: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  dataset: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  file: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  book: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  project: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
}

export function ContentGrid({
  limit = 6,
  type,
  featured = false,
}: {
  limit?: number
  type?: string
  featured?: boolean
}) {
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadContent() {
      try {
        let data = []
        const params = { limit, featured }
        
        switch (type) {
          case "blog": {
            const res = await getBlogs(params)
            data = res.blogs || res.data || []
            break
          }
          case "snippet": {
            const res = await getSnippets(params)
            data = res.snippets || res.data || []
            break
          }
          case "dataset": {
            const res = await getDatasets(params)
            data = res.datasets || res.data || []
            break
          }
          case "file": {
            const res = await getFiles(params)
            data = res.files || res.data || []
            break
          }
          case "book": {
            const res = await getBooks(params)
            data = res.books || res.data || []
            break
          }
          case "project": {
            const res = await getProjects(params)
            data = res.projects || res.data || []
            break
          }
          default: {
            if (featured) {
              // For featured content on homepage, fetch from all types
              const [blogs, snippets, datasets, files, books, projects] = await Promise.all([
                getBlogs({ limit: 2, featured: true }),
                getSnippets({ limit: 2, featured: true }),
                getDatasets({ limit: 2, featured: true }),
                getFiles({ limit: 2, featured: true }),
                getBooks({ limit: 2, featured: true }),
                getProjects({ limit: 2, featured: true })
              ])
              data = [
                ...(blogs.data || []),
                ...(snippets.data || []),
                ...(datasets.data || []),
                ...(files.data || []),
                ...(books.data || []),
                ...(projects.data || [])
              ]
            }
          }
        }
        setContent(data)
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [type, featured, limit])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {Array(limit)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-24 bg-muted" />
              <CardContent className="p-4">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="mt-2 h-4 w-1/2 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {content.map((item) => {
        const Icon = typeIcons[item.type]
        const colorClass = typeColors[item.type]

        return (
          <Link href={`/${item.type}s/${item._id}`} key={item._id}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={colorClass}>
                    <Icon className="mr-1 h-3 w-3" />
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </div>
                </div>
                <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-1 p-4 pt-0">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{item.tags.length - 3}
                  </Badge>
                )}
              </CardFooter>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
