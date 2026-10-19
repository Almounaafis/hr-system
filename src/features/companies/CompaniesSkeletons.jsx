import { Skeleton } from "@/components/skeletons/RequestsSkeltons";

 

 
export function CompanyRowSkeleton() {
  return (
    <>
      {/* Logo + name */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-20 rounded-full" />
      </td>

      {/* Branches */}
      <td className="py-4 px-4">
        <div className="flex gap-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </td>

      {/* Departments */}
      <td className="py-4 px-4">
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
      </td>

      {/* HR */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </td>

      {/* Employees count */}
      <td className="py-4 px-4">
        <Skeleton className="h-6 w-10 rounded-full" />
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </td>
    </>
  );
}