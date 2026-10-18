import { Skeleton } from "./RequestsSkeltons";

function HeaderSkeleton() {
  return (
    <div className="bg-gradient-to-r from-[#E8F5F3] to-[#F0F9FF] px-2 py-4 md:p-4 sm:p-6">
      <div className="flex items-center mt-4 md:mt-6 gap-2 justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Skeleton className="h-13 w-13 sm:h-20 sm:w-20 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-5 sm:h-6 w-36 sm:w-44" />
            <Skeleton className="h-3.5 w-24 sm:w-28" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-md" />
          <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}


function TabsSkeleton() {
  return (
    <div className="flex gap-3 sm:gap-6 border-b border-border px-3 sm:px-6 pt-3 sm:pt-4 pb-0">
      {[64, 96, 64].map((w, i) => (
        <div key={i} className="pb-3 flex-shrink-0">
          <Skeleton className="h-4 w-full" style={{ width: w }} />
        </div>
      ))}
    </div>
  );
}


function InfoRowSkeleton({ valueWidth = 160 }) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded-sm mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4" style={{ width: valueWidth }} />
      </div>
    </div>
  );
}

/**
 * Mirrors a SectionHeader + a 2-column InfoRow grid.
 */
function SectionSkeleton({ titleWidth = 140, rows = 4, cols = 2 }) {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Skeleton className="h-8 w-8 sm:h-11 sm:w-11 rounded-lg shrink-0" />
        <Skeleton className="h-4 sm:h-5" style={{ width: titleWidth }} />
      </div>

      {/* Info rows */}
      <div className={`grid grid-cols-1 ${cols === 2 ? "sm:grid-cols-2" : ""} gap-3 sm:gap-4`}>
        {Array.from({ length: rows }).map((_, i) => (
          <InfoRowSkeleton key={i} valueWidth={140 + (i % 3) * 20} />
        ))}
      </div>
    </div>
  );
}

/**
 * "Contracts" tab: file-document rows with download/delete actions.
 */
function ContractsTabSkeleton({ rows = 3 }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Skeleton className="h-8 w-8 sm:h-11 sm:w-11 rounded-lg shrink-0" />
        <Skeleton className="h-4 sm:h-5 w-32" />
      </div>

      <div className="space-y-2 sm:space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex md:items-center justify-between p-2 sm:p-4 border border-border bg-muted rounded-lg"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 sm:gap-3 min-w-0">
              <Skeleton className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg shrink-0" />
              <div className="space-y-1.5 min-w-0">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-md" />
              <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

 
function PayrollTabSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Skeleton className="h-8 w-8 sm:h-11 sm:w-11 rounded-lg shrink-0" />
        <Skeleton className="h-4 sm:h-5 w-32" />
      </div>

      <div className="space-y-3">
        {/* A summary card */}
        <Skeleton className="h-24 w-full rounded-lg" />
        {/* Two smaller blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
        {/* A final table-ish block */}
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  );
}

 
export function EmployeeDetailSheetSkeleton({ activeTab = "details" }) {
  const renderTab = () => {
    switch (activeTab) {
      case "payroll":
        return <PayrollTabSkeleton />;
      case "contracts":
        return <ContractsTabSkeleton rows={3} />;
      case "details":
      default:
        return (
          <div className="space-y-6 sm:space-y-8">
            <SectionSkeleton titleWidth={140} rows={5} cols={2} />
            <SectionSkeleton titleWidth={120} rows={5} cols={2} />
          </div>
        );
    }
  };

  return (
    <div aria-busy="true" aria-live="polite">
      <HeaderSkeleton />
      <TabsSkeleton />
      <div className="px-3 sm:px-6 pt-4 sm:pt-6">{renderTab()}</div>
    </div>
  );
}