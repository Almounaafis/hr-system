import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function TableShared({ 
  columns,
  data,
  onRowClick,
  rowClassName = "",
  emptyMessage = "لا توجد بيانات",
  isLoading = false
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted">
          {columns.map((column, index) => (
            <TableHead 
              key={index} 
              className={`text-right font-semibold text-foreground ${column.className || ""}`}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
              <div className="flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell 
              colSpan={columns.length} 
              className="text-center py-8 text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, rowIndex) => (
            <TableRow 
              key={row.id || rowIndex} 
              className={`hover:bg-muted cursor-pointer ${rowClassName}`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column, colIndex) => (
                <TableCell 
                  key={colIndex} 
                  className={column.cellClassName || ""}
                >
                  {column.render ? column.render(row, rowIndex) : row[column.accessor]}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
