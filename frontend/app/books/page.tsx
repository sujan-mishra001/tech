"use client"

import { Suspense } from "react"
import { ContentGrid } from "@/components/content-grid"
import { ContentFilters } from "@/components/content-filters"
import { Skeleton } from "@/components/ui/skeleton"

// Separate component that uses useSearchParams inside ContentFilters
function FiltersWithSearch() {
  return <ContentFilters contentType="book" />
}

export default function BooksPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Books</h1>
        <p className="text-muted-foreground">Discover recommended books for data science and machine learning</p>
      </div>

      {/* Wrap ContentFilters in Suspense */}
      <Suspense fallback={<div className="h-10 w-full rounded-md bg-muted animate-pulse"></div>}>
        <FiltersWithSearch />
      </Suspense>

      <div className="mt-6">
        <Suspense fallback={<ContentGridSkeleton />}>
          <ContentGrid type="book" limit={12} />
        </Suspense>
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
