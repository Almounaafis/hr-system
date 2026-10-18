// @/features/attendance/AttendanceTableSkeleton.jsx
import { Skeleton } from "@/components/skeletons/RequestsSkeltons";

/**
 * Returns the <td>s for one attendance skeleton row.
 * Matches every column of AttendanceTable.
 */
export function AttendanceRowSkeleton() {
  return (
    <>
      <td className="py-3 px-2 w-8">
        <Skeleton className="h-4 w-4 rounded" />
      </td>

      <td className="py-3 px-2">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>
      </td>

      <td className="py-3 px-2">
        <Skeleton className="h-5 w-20 rounded-md" />
      </td>

      <td className="py-3 px-2">
        <Skeleton className="h-3.5 w-24" />
      </td>

      <td className="py-3 px-2">
        <Skeleton className="h-3.5 w-16" />
      </td>

      <td className="py-3 px-2">
        <Skeleton className="h-3.5 w-16" />
      </td>

      <td className="py-3 px-2">
        <Skeleton className="h-7 w-28 rounded-lg" />
      </td>

      <td className="py-3 px-2">
        <Skeleton className="h-3.5 w-20" />
      </td>

      <td className="py-3 px-2">
        <Skeleton className="h-8 w-24 rounded-md" />
      </td>
    </>
  );
}