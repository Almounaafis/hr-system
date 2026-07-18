import { cn } from "@/lib/utils";
import { CalendarDays, Users, Pencil, Trash2 } from "lucide-react";
import { Sun, Moon, Clock } from "lucide-react";

const shiftToneByName = {
  "الشيفت الصباحي": { icon: Sun, tone: "amber" },
  "الشيفت المسائي": { icon: Moon, tone: "purple" }
};

function getShiftVisual(name) {
  return shiftToneByName[name] ?? { icon: Clock, tone: "blue" };
}

export function ShiftCard({ shift, onEdit, onDelete }) {
  const { icon: Icon, tone } = getShiftVisual(shift.name);
  const toneClasses = {
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600"
  };

  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <div className="flex items-center gap-2 pb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", toneClasses[tone])}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="">
          <h4 className="text-base font-semibold text-foreground">{shift.name}</h4>
          <p className="text-sm text-foreground mt-2">
            {shift.fromTime} - {shift.toTime}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 border-b pb-3 border-gray-200">
        <CalendarDays className="w-3.5 h-3.5" />
        <span>{shift.fromDay} : {shift.toDay}</span>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 text-sm text-foreground">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{shift.employeeCount} موظف</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(shift)}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
            aria-label="تعديل الشيفت"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(shift.id)}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-muted-foreground hover:text-rose-600 hover:border-rose-200 transition-colors"
            aria-label="حذف الشيفت"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
