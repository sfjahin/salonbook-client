import { StatsSkeleton, TableSkeleton } from "@/components/loaders"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 border-b pb-8">
        <div className="h-3 w-40 animate-pulse rounded bg-muted" />
        <div className="h-10 w-2/3 max-w-md animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 max-w-sm animate-pulse rounded bg-muted" />
      </div>

      <StatsSkeleton />
      <TableSkeleton rows={4} />
    </div>
  )
}
