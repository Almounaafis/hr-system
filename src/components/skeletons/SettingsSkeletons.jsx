import { Skeleton } from "./RequestsSkeltons";

const COLS_MAP = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

function SettingsHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-7 sm:h-8 w-40" />
      <Skeleton className="h-10 w-full sm:w-40 rounded-lg" />
    </div>
  );
}

function SettingsTabBarSkeleton() {
  return (
    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1">
      {[80, 96, 88, 112, 104].map((w, i) => (
        <Skeleton key={i} className="h-10 rounded-lg shrink-0" style={{ width: w }} />
      ))}
    </div>
  );
}

function FormFieldSkeleton({ labelWidth = 96, controlHeight = 40 }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3.5" style={{ width: labelWidth }} />
      <Skeleton className="w-full rounded-lg" style={{ height: controlHeight }} />
    </div>
  );
}

function SettingsSectionSkeleton({ titleWidth = 140, fields = 4, cols = 2 }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-4">
      <Skeleton className="h-5" style={{ width: titleWidth }} />
      <div className={`grid grid-cols-1 ${COLS_MAP[cols] || COLS_MAP[2]} gap-4`}>
        {Array.from({ length: fields }).map((_, i) => (
          <FormFieldSkeleton key={i} labelWidth={80 + (i % 3) * 12} />
        ))}
      </div>
    </div>
  );
}

function PayrollCycleTabSkeleton() {
  return (
    <div className="space-y-4">
      <SettingsSectionSkeleton titleWidth={160} fields={0} />
      {/* Radio option cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-border p-4"
          >
            <Skeleton className="h-4 w-4 rounded-full shrink-0 mt-1" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
      <SettingsSectionSkeleton titleWidth={120} fields={2} cols={2} />
    </div>
  );
}

function LocationTabSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-48 sm:h-56 w-full rounded-xl" />
      <SettingsSectionSkeleton titleWidth={130} fields={4} cols={2} />
      <SettingsSectionSkeleton titleWidth={180} fields={2} cols={2} />
    </div>
  );
}

function WorkHoursTabSkeleton() {
  return (
    <div className="space-y-4">
      <SettingsSectionSkeleton titleWidth={120} fields={2} cols={2} />
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeductionsTabSkeleton() {
  return (
    <div className="space-y-4">
      <SettingsSectionSkeleton titleWidth={140} fields={2} cols={2} />
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-3 pb-2 border-b border-border">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-3.5 w-20" />
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="grid grid-cols-3 gap-3 items-center">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 flex-1 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-md shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaveBalanceTabSkeleton() {
  return (
    <div className="space-y-4">
      <SettingsSectionSkeleton titleWidth={150} fields={3} cols={3} />
      <SettingsSectionSkeleton titleWidth={180} fields={1} cols={1} />
    </div>
  );
}

export function SettingsPageSkeleton({ activeTab = "payroll-cycle" }) {
  const renderTab = () => {
    switch (activeTab) {
      case "location":
        return <LocationTabSkeleton />;
      case "work-hours":
        return <WorkHoursTabSkeleton />;
      case "deductions":
        return <DeductionsTabSkeleton />;
      case "leave-balance":
        return <LeaveBalanceTabSkeleton />;
      case "payroll-cycle":
      default:
        return <PayrollCycleTabSkeleton />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5" aria-busy="true" aria-live="polite">
      <SettingsHeaderSkeleton />
      <SettingsTabBarSkeleton />
      <div className="text-sm sm:text-base">{renderTab()}</div>
    </div>
  );
}