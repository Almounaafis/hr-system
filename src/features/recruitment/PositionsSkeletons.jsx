// @/features/recruitment/PositionsSkeletons.jsx

import { Skeleton } from "@/components/skeletons/RequestsSkeltons";

 
export function PositionRowSkeleton() {
  return (
    <>
      {/* Title */}
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-32" />
      </td>

      {/* Department */}
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-20 rounded-md" />
      </td>

      {/* Description */}
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-40" />
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>

      {/* Custom Fields Count */}
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-10 rounded-full" />
      </td>

      {/* Created At */}
      <td className="py-4 px-4">
        <Skeleton className="h-3.5 w-24" />
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </td>
    </>
  );
}