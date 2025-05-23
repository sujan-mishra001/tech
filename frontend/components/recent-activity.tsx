"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Code, Database, FileType2, BookOpen, FolderKanban, Plus, Edit } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fetchRecentActivity } from "@/lib/mongodb"

type ActivityItem = {
  _id: string
  action: "created" | "updated" | "viewed"
  contentType: "blog" | "snippet" | "dataset" | "file" | "book" | "project"
  contentId: string
  contentTitle: string
  timestamp: string
}

const typeIcons = {
  blog: FileText,
  snippet: Code,
  dataset: Database,
  file: FileType2,
  book: BookOpen,
  project: FolderKanban,
}

const actionIcons = {
  created: Plus,
  updated: Edit,
  viewed: () => null,
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadActivities() {
      try {
        // In a real app, this would fetch from MongoDB Data API
        const data = await fetchRecentActivity()
        setActivities(data)
      } catch (error) {
        console.error("Error fetching activities:", error)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading
            ? Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))
            : activities.map((activity) => {
                const ContentIcon = typeIcons[activity.contentType]
                const ActionIcon = actionIcons[activity.action]

                return (
                  <div key={activity._id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>DS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">You</span>{" "}
                        <span className="text-muted-foreground">
                          {activity.action === "created"
                            ? "created a new"
                            : activity.action === "updated"
                              ? "updated a"
                              : "viewed a"}{" "}
                        </span>
                        <Link
                          href={`/${activity.contentType}s/${activity.contentId}`}
                          className="font-medium hover:underline"
                        >
                          <ContentIcon className="mb-0.5 ml-0.5 mr-0.5 inline-block h-3 w-3" />
                          {activity.contentTitle}
                        </Link>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                )
              })}
        </div>
      </CardContent>
    </Card>
  )
}
