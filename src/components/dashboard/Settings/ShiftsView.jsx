import { Plus } from "lucide-react";
import { FormLabel } from "@/components/ui/form-field";
import { ShiftCard } from "./ShiftCard";

export function ShiftsView({ shifts, onAddShift, onDeleteShift, onEditShift }) {
  return (
    <div className="mt-5">
      <FormLabel>نوع الجدول</FormLabel>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {shifts.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} onEdit={onEditShift} onDelete={onDeleteShift} />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddShift}
        className="w-full mt-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 text-primary py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-primary/10 transition-colors"
      >
        <Plus className="w-4 h-4" />
        اضافة شيفت
      </button>
    </div>
  );
}
