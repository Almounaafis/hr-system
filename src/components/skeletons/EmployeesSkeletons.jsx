import { Skeleton } from "./RequestsSkeltons";

export function EmployeeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 sm:p-4 shadow-sm">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-4 rounded-sm" />
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </div>

      {/* AVATAR + INFO */}
      <div className="mt-3 flex flex-col items-center text-center">
        <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-full" />
        <Skeleton className="mt-2 sm:mt-3 h-4 w-28" />
        <Skeleton className="mt-1.5 h-3 w-20" />
      </div>

      {/* ID + JOIN + CONTACT */}
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-[#EDF8FC] px-2 sm:px-3 py-2">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-10 bg-[#1010110F]" />
          <Skeleton className="h-3.5 w-16 bg-[#1010110F]" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-10 bg-[#1010110F]" />
          <Skeleton className="h-3.5 w-14 bg-[#1010110F]" />
        </div>

        <div className="col-span-2 space-y-2 border-t border-[#E0E0E1] pt-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3 shrink-0 bg-[#1010110F]" />
            <Skeleton className="h-3 w-40 bg-[#1010110F]" />
          </div>
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3 shrink-0 bg-[#1010110F]" />
            <Skeleton className="h-3 w-28 bg-[#1010110F]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmployeesGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <EmployeeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrgChartSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {/* Mobile: accordion cards */}
      <div className="block md:hidden space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border overflow-hidden">
            <Skeleton className="h-12 w-full rounded-none" />
            <div className="p-3 space-y-2">
              {Array.from({ length: 2 }).map((__, j) => (
                <div
                  key={j}
                  className="flex items-center gap-3 rounded-2xl border border-border p-2.5"
                >
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-2.5 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: columns */}
      <div className="hidden md:flex items-start gap-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-52 lg:w-64 space-y-3">
            <Skeleton className="h-10 w-full rounded-2xl" />
            {Array.from({ length: 3 }).map((__, j) => (
              <div
                key={j}
                className="flex items-center gap-3 rounded-2xl border border-border p-2.5"
              >
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}