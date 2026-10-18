import { Skeleton } from "./RequestsSkeltons";
import { Separator } from "@/components/ui/separator";


function SectionDividerSkeleton({ width = 80 }) {
  return (
    <div className="flex items-center gap-4 overflow-hidden my-5">
      <Skeleton className="h-6" style={{ width }} />
      <Separator className="bg-[#C0C0C0]" />
    </div>
  );
}


export function NotificationCardSkeleton({ unread = false }) {
  return (
    <div className="relative flex items-start gap-3 sm:gap-4 rounded-2xl border border-border bg-card p-3 sm:p-4 mb-3 shadow-sm">
      {/* Unread indicator strip (optional, matches typical card design) */}
      {unread && (
        <span className="absolute right-0 top-4 bottom-4 w-1 rounded-l-full bg-primary/40" />
      )}

      {/* Leading image / icon */}
      <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Skeleton className="h-4 w-32 sm:w-40" />
            <Skeleton className="h-5 w-14 rounded-full shrink-0" />
          </div>
          <Skeleton className="h-3 w-16 shrink-0" />
        </div>

        {/* Description lines */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-7 w-20 rounded-md" />
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
}


function NotificationSectionSkeleton({ count = 3, dividerWidth = 80 }) {
  return (
    <>
      <SectionDividerSkeleton width={dividerWidth} />
      {Array.from({ length: count }).map((_, i) => (
        <NotificationCardSkeleton key={i} unread={i === 0} />
      ))}
    </>
  );
}

export function NotificationsListSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <NotificationSectionSkeleton count={3} dividerWidth={60} />  {/* اليوم */}
      <NotificationSectionSkeleton count={2} dividerWidth={70} />  {/* أمس */}
      <NotificationSectionSkeleton count={1} dividerWidth={90} />  {/* أقدم */}
    </div>
  );
}