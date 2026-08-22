import { useState, memo } from "react";
import { Mail, Phone } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "./StatusBadge";
import { CardMenu } from "./CardMenu";
import { formatJoinDate, formatEmployeeId } from "./utils";

const EmployeeCard = memo(function EmployeeCard({
  employee,
  selected,
  onToggleSelect,
  onOpen,
  onEdit,
  onDelete,
  onSchedule,
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="
        cursor-pointer rounded-2xl border border-border bg-background
        p-3 sm:p-4
        shadow-sm transition-all
        hover:border-border hover:shadow-md
      "
    >
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(employee.id)}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4"
        />

        <div className="flex items-center gap-1 sm:gap-1.5">
          <StatusBadge status={employee.status} />
           <CardMenu
            employee={employee}
            onEdit={() => onEdit(employee)}
            onDelete={() => onDelete(employee.id)}
            onOpen={() => onOpen(employee)}
            onSchedule={() => onSchedule(employee)}
          />
        </div>
      </div>

      {/* AVATAR + INFO */}
      <div className="mt-3 flex flex-col items-center text-center">
        <div className="h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-full bg-muted">
          {employee.photo && !imgError ? (
            <img
              src={employee.photo}
              alt={employee.name}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center text-xs sm:text-sm font-semibold ${employee.avatarBg} ${employee.avatarColor}`}
            >
              {employee.avatar}
            </div>
          )}
        </div>

        <h3 className="mt-2 sm:mt-3 text-sm sm:text-[15px] font-semibold text-foreground">
          {employee.name}
        </h3>

        <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
          {employee.position}
        </p>
      </div>

      {/* ID + JOIN */}
      <div
        className="
          mt-3 grid grid-cols-2 gap-2
          rounded-xl bg-[#EDF8FC]
          px-2 sm:px-3 py-2
        "
      >
        <div>
          <p className="text-xs sm:text-base text-[#101011B2]">رقم ID</p>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-[#101011]">
            {formatEmployeeId(employee.employeeCode || employee.employee_code || employee.id)}
          </p>
        </div>

        <div>
          <p className="text-xs sm:text-base text-[#101011B2]">انضم في</p>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-semibold text-[#101011]">
            {formatJoinDate(employee.joinDate)}
          </p>
        </div>

        {/* CONTACT */}
        <div className="border-t border-[#E0E0E1] col-span-2 space-y-2 pt-2">
          
          <div className="flex items-center gap-1.5 text-xs sm:text-base text-[#101011]">
            <Mail className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs sm:text-base text-[#101011]">
            <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
            <span className="truncate">{employee.phone}</span>
          </div>

        </div>
      </div>
    </div>
  );
});

export default EmployeeCard;