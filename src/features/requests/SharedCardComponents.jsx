import { Button } from "@/components/ui/button";

export function Avatar({ request }) {
  const employee = request.employee || {};
  const initials = employee.name?.charAt(0) || "E";

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 bg-teal-100 text-teal-700"
    >
      {initials}
    </div>
  );
}

export function ViewButton({ onClick }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 rounded-lg text-xs text-primary border-[#DCF1F9] bg-[#DCF1F9] font-medium px-3"
      onClick={onClick}
    >
      عرض
    </Button>
  );
}

export function FieldPair({ leftLabel, leftValue, rightLabel, rightValue }) {
  return (
    <div className="flex items-start justify-between mt-3  ">
      <div>
        <p className="text-[11px] text-muted-foreground mb-0.5">{rightLabel}</p>
        <p className="text-xs font-semibold text-foreground">{rightValue}</p>
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground mb-0.5">{leftLabel}</p>
        <p className="text-xs font-semibold text-foreground">{leftValue}</p>
      </div>
    </div>
  );
}

export function RequestCardShell({ request, onView, children }) {
  const employee = request.employee || {};

  return (
    <div className="bg-card border border-border rounded-xl p-3.5">
      <div className="flex items-start justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2.5">
          <Avatar request={request} />
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">{employee.name || "—"}</p>
            <p className="text-xs text-muted-foreground">{employee.department || "—"}</p>
          </div>
        </div>
        <ViewButton onClick={() => onView(request)} />
      </div>
      {children}
    </div>
  );
}
