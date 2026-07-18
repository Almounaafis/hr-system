import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TableShared({ 
  columns,
  data,
  onRowClick,
  rowClassName = "",
  emptyMessage = "لا توجد بيانات"
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
        {data.length === 0 ? (
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
