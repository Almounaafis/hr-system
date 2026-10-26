// @/features/recruitment/ApplicationsSkeletons.jsx
import { Skeleton } from "@/components/skeletons/RequestsSkeltons";

export function ApplicationRowSkeleton() {
  return (
    <>
      {/* Applicant Name + Email */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </td>

      {/* Position */}
      <td className="py-4 px-4">
        <div className="space-y-1.5 min-w-0">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </td>

      {/* Score */}
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-8 rounded" />
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>

      {/* Date */}
      <td className="py-4 px-4">
        <Skeleton className="h-3.5 w-24" />
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex justify-end">
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      </td>
    </>
  );
}







// Add this to @/features/recruitment/ApplicationsSkeletons.jsx
export function ApplicationDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-20 rounded-full mt-2" />
      </div>
      
      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>

      {/* CV block */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>

      {/* Extra data */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}