// Add/Update this in @/features/companies/CompaniesSkeletons.jsx
import { Skeleton } from "@/components/skeletons/RequestsSkeltons";

/**
 * Row skeleton for the Global HR table.
 * Columns: Company | Name+Email | Phone | Status | Joined Date
 */
export function HrRowSkeleton() {
  return (
    <>
      {/* Company */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded shrink-0" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </td>

      {/* Name + Email */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </td>

      {/* Phone */}
      <td className="py-4 px-4">
        <Skeleton className="h-3.5 w-24" />
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>

      {/* Joined Date */}
      <td className="py-4 px-4">
        <Skeleton className="h-3.5 w-24" />
      </td>
    </>
  );
}