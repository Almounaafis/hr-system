import { Card } from "@/components/ui/card";

export function ColumnHeader({ column, count }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span
        className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold"
        style={{ background: column.bg, color: column.color }}
      >
        {column.label}
      </span>
      <span className="text-sm font-semibold text-muted-foreground">{count}</span>
    </div>
  );
}

export function RequestColumn({ column, requests, renderCard, onView }) {
  return (
    <Card className="border-border bg-muted p-4 w-[calc(100vw-64px)] sm:w-[335px] sm:min-w-[335px] flex-shrink-0">
      <ColumnHeader column={column} count={requests.length} />
      <div className="space-y-3 max-h-[640px] overflow-y-auto pr-0.5">
        {requests.map((request) => renderCard(request, onView))}
        {requests.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xs text-muted-foreground">لا توجد طلبات مطابقة</p>
          </div>
        )}
      </div>
    </Card>
  );
}