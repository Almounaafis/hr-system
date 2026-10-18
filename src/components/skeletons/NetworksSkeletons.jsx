// @/components/skeletons/NetworksSkeletons.jsx
import { Skeleton } from "./RequestsSkeltons";

/**
 * Returns the <td>s for one network skeleton row.
 */
export function NetworkRowSkeleton() {
  return (
    <>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-[35px] h-[35px] rounded-sm" />
          <Skeleton className="h-4 w-28" />
        </div>
      </td>

      <td className="py-4 px-4">
        <Skeleton className="h-4 w-20" />
      </td>

      <td className="py-4 px-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </td>

      <td className="py-4 px-4">
        <Skeleton className="h-4 w-32" />
      </td>

      <td className="py-4 px-4">
        <Skeleton className="h-4 w-40" />
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </td>
    </>
  );
}