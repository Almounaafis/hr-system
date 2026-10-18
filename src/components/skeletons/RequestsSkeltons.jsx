import { cn } from "@/lib/utils";


export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:animate-[shimmer_1.6s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}


export function RequestCardSkeleton({ compact = false }) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      {/* Header row: avatar, name/department, status */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full shrink-0" />
      </div>

      {/* FieldPair grid */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-3.5 w-24" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-12" />
          <Skeleton className="h-3.5 w-20" />
        </div>
      </div>

      {!compact && (
        <>
          {/* Divider */}
          <div className="h-px bg-border/70" />

          {/* Footer row: small meta + chevron */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-4 rounded-sm" />
          </div>
        </>
      )}
    </div>
  );
}

export function RequestColumnSkeleton({ cardCount = 3 }) {
  return (
    <div className="w-72 flex-shrink-0 space-y-4">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-5 w-7 rounded-full" />
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {Array.from({ length: cardCount }).map((_, i) => (
          <RequestCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function KanbanSkeleton() {
  const columnCardCounts = [2, 3, 2, 3, 1, 2];
  return (
    <div className="flex gap-4 p-1 min-w-max snap-x snap-mandatory sm:snap-none">
      {columnCardCounts.map((count, i) => (
        <div key={i} className="snap-start snap-always">
          <RequestColumnSkeleton cardCount={count} />
        </div>
      ))}
    </div>
  );
}

export function RequestsToolbarSkeleton() {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}