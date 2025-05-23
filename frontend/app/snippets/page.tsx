"use client"

import { Suspense } from "react"
import { ContentGrid } from "@/components/content-grid"
import { ContentFilters } from "@/components/content-filters"
import { Skeleton } from "@/components/ui/skeleton"
import { getSnippets } from "@/lib/api"

// Separate component that uses useSearchParams inside ContentFilters
function FiltersWithSearch() {
  return <ContentFilters contentType="snippet" />
}

export default async function SnippetsPage() {
  let snippets = []
  try {
    const data = await getSnippets()
    snippets = data?.data || []
  } catch (e) {
    snippets = []
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Code Snippets</h1>
        <p className="text-muted-foreground">Browse and use helpful data science code snippets</p>
      </div>

      {/* Wrap ContentFilters in Suspense */}
      <Suspense fallback={<div className="h-10 w-full rounded-md bg-muted animate-pulse"></div>}>
        <FiltersWithSearch />
      </Suspense>

      <div className="mt-6">
        {/* Render snippets if available, else show skeleton/empty */}
        {snippets.length > 0 ? (
          <Suspense fallback={<ContentGridSkeleton />}>
            <ContentGrid type="snippet" limit={12} />
          </Suspense>
        ) : (
          <ContentGridSkeleton />
        )}
      </div>
    </div>
  )
}

function ContentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
    </div>
  )
}
