import { Suspense } from "react"
import { HomeHeader } from "@/components/home-header"
import { ContentGrid } from "@/components/content-grid"
import { RecentActivity } from "@/components/recent-activity"
import { ContentStats } from "@/components/content-stats"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <HomeHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-semibold">Featured Content</h2>
          <Suspense fallback={<ContentGridSkeleton />}>
            <ContentGrid limit={6} featured={true} />
          </Suspense>
        </div>

        <div className="flex flex-col gap-6">
          <ContentStats />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}

function ContentGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array(6)
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
