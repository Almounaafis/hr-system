// @/components/skeletons/PayrollSkeletons.jsx
import { Skeleton } from "./RequestsSkeltons";

/**
 * Skeleton <td>s matching the PayrollTable columns.
 */
export function PayrollRowSkeleton() {
  return (
    <>
      {/* Checkbox + code */}
      <td className="py-3 px-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-10" />
        </div>
      </td>

      {/* Avatar + name / department */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </td>

      {/* Gross */}
      <td className="py-4 px-4">
        <Skeleton className="h-3.5 w-16 ml-auto" />
      </td>

      {/* Basic salary */}
      <td className="py-4 px-4">
        <Skeleton className="h-3.5 w-16 ml-auto" />
      </td>

      {/* Deductions pill */}
      <td className="py-4 px-4">
        <div className="flex justify-end">
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </td>

      {/* Net salary */}
      <td className="py-4 px-4">
        <Skeleton className="h-3.5 w-20 ml-auto" />
      </td>

      {/* Status badge */}
      <td className="py-4 px-4">
        <div className="flex justify-center">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 px-2">
        <div className="flex justify-end">
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </td>
    </>
  );
}