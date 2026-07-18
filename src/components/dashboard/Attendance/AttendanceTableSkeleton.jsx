export function AttendanceTableSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-2 py-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
          <div className="w-9 h-9 rounded-full bg-muted animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
            <div className="h-2.5 w-1/5 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-3 w-16 rounded bg-muted animate-pulse hidden sm:block" />
          <div className="h-3 w-16 rounded bg-muted animate-pulse hidden sm:block" />
          <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}
