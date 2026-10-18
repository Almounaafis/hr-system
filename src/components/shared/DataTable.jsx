// @/components/shared/DataTable.jsx
import { Skeleton } from "@/components/skeletons/RequestsSkeltons";

/**
 * Generic, reusable table. Replaces the old `TableShared`.
 *
 * Props:
 *  - columns: Array<{
 *      key: string,
 *      header: ReactNode,
 *      headerClassName?: string,
 *      cellClassName?: string,
 *      render?: (row) => ReactNode,  // if omitted, row[key] is rendered
 *    }>
 *  - data: Array<object>
 *  - isLoading: boolean
 *  - isError: boolean
 *  - errorMessage: string
 *  - emptyMessage: string
 *  - skeletonRows: number (default 5)
 *  - renderSkeletonRow?: () => ReactNode  // returns the <td>s
 *  - getRowKey?: (row, i) => string|number
 *  - onRetry?: () => void
 *  - wrapperClassName?: string
 *  - tableClassName?: string
 */
export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  isError = false,
  errorMessage = "حدث خطأ في تحميل البيانات",
  emptyMessage = "لا توجد بيانات",
  skeletonRows = 5,
  renderSkeletonRow,
  getRowKey,
  onRetry,
  wrapperClassName = "w-full overflow-x-auto rounded-lg",
  tableClassName = "w-full text-sm text-right",
}) {
  const colCount = columns.length;
  const keyFor = (row, i) => (getRowKey ? getRowKey(row, i) : row?.id ?? i);

  const renderSkeleton = () => {
    if (renderSkeletonRow) {
      return Array.from({ length: skeletonRows }).map((_, i) => (
        <tr key={i} className="hover:bg-muted/30">
          {renderSkeletonRow()}
        </tr>
      ));
    }
    return Array.from({ length: skeletonRows }).map((_, i) => (
      <tr key={i} className="hover:bg-muted/30">
        {columns.map((col, j) => (
          <td
            key={col.key ?? j}
            className={["py-4 px-4", col.cellClassName].filter(Boolean).join(" ")}
          >
            <Skeleton className="h-4 w-24" />
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className={wrapperClassName}>
      <table className={tableClassName}>
        <thead className="bg-muted/50 text-muted-foreground border-b border-border">
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key ?? i}
                className={[
                  "py-3 px-4 font-medium",
                  i === 0 && "rounded-tr-lg",
                  i === columns.length - 1 && "rounded-tl-lg",
                  col.headerClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {isLoading ? (
            renderSkeleton()
          ) : isError ? (
            <tr>
              <td colSpan={colCount} className="py-8 text-center">
                <p className="text-destructive">{errorMessage}</p>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="mt-2 text-sm text-primary underline underline-offset-4 hover:opacity-80"
                  >
                    إعادة المحاولة
                  </button>
                )}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="py-8 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={keyFor(row, i)} className="hover:bg-muted/30 transition-colors">
                {columns.map((col, j) => (
                  <td
                    key={col.key ?? j}
                    className={["py-4 px-4", col.cellClassName]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}