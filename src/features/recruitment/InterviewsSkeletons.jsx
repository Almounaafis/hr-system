// @/features/recruitment/InterviewsSkeletons.jsx
import { Skeleton } from "@/components/skeletons/RequestsSkeltons";

export function InterviewRowSkeleton() {
  return (
    <>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-3.5 w-32" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-3.5 w-20" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-3.5 w-24" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
      <td className="py-4 px-4">
        <div className="flex justify-end">
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      </td>
    </>
  );
}