import { useState, useRef, useMemo } from "react";
import { Plus, Printer, X, ChevronDown, Check, Loader2, Trash2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField, FormLabel } from "@/components/ui/form-field";
import EmployeeMultiSelect from "@/shared/components/EmployeeMultiSelect";
import { useOrgChartData } from "@/components/dashboard/Employees/hooks/useOrgChartData";
import { useCrud } from "@/hooks/useCrud";
import FormInput from "@/shared/forms/FormInput";
import { useForm, Controller } from "react-hook-form";

const DEPARTMENT_COLORS = [
  { id: "teal", dot: "#4E9DA8", bg: "#4E9DA8", text: "#FFFFFF" },
  { id: "orange", dot: "#F5A623", bg: "#F5A623", text: "#FFFFFF" },
  { id: "blue", dot: "#27a9b5", bg: "#27a9b5", text: "#FFFFFF" },
  { id: "green", dot: "#22A559", bg: "#22A559", text: "#FFFFFF" },
  { id: "pink", dot: "#E0457B", bg: "#E0457B", text: "#FFFFFF" },
];

function colorFor(id) {
  return DEPARTMENT_COLORS.find((c) => c.id === id) || DEPARTMENT_COLORS[0];
}

// ─── Person node ───────────────────────────────────────────────────────────────

function PersonNode({
  name,
  title,
  photo,
  isHead,
  onMakeHead,
  onRemove,
  isPromoting,
  isRemoving,
}) {
  const showActions = !!onMakeHead || !!onRemove;

  return (
    <div
      dir="ltr"
      className="group relative flex items-center gap-1 sm:gap-3 rounded-2xl border border-border bg-card px-1 sm:px-3 py-1 sm:py-2.5 shadow-sm text-left w-full"
    >
      <div className="h-7 w-7 sm:h-9 sm:w-9 flex-shrink-0 overflow-hidden rounded-full bg-muted">
  {photo ? (
    <img
      src={photo}
      alt={name}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-[10px] sm:text-xs font-semibold uppercase">
      {name
        ?.split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("") || "?"}
    </div>
  )}
</div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] sm:text-sm font-semibold text-foreground">{name}</p>
        <p className="truncate text-[10px] sm:text-xs text-muted-foreground">{title}</p>
      </div>
      {isHead && (
        <span className="flex-shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-primary">
          مدير
        </span>
      )}

      {showActions && (
        <div className="flex items-center gap-1">
          {!isHead && onMakeHead && (
            <button
              type="button"
              title="تعيين كمدير"
              onClick={onMakeHead}
              disabled={isPromoting}
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary disabled:opacity-50"
            >
              {isPromoting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Crown className="h-3.5 w-3.5" />}
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              title="حذف من القسم"
              onClick={onRemove}
              disabled={isRemoving}
              className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
            >
              {isRemoving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mobile department card (accordion style) ────────────────────────────────

function MobileDepartmentCard({ department, onMakeHead, onRemoveEmployee, pendingAction }) {
  const [expanded, setExpanded] = useState(false);
  const color = colorFor(department.colorId);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-2 md:px-4 py-2 md:py-3"
        style={{ backgroundColor: color.bg }}
      >
        <span className="text-[10px] md:text-sm font-semibold" style={{ color: color.text }}>
          {department.name}
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-background/20"
            style={{ color: color.text }}
          >
            {department.members.length} موظف
          </span>
          <ChevronDown
            className="h-4 w-4 transition-transform"
            style={{ color: color.text, transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>

      {expanded && department.members.length > 0 && (
        <div className="p-3 space-y-2 bg-muted">
          {department.members.map((member) => (
            <PersonNode
              key={member.id}
              name={member.name}
              title={member.title}
              photo={member.photo}
              isHead={member.isHead}
              onMakeHead={onMakeHead ? () => onMakeHead(department.id, member.id) : undefined}
              onRemove={onRemoveEmployee ? () => onRemoveEmployee(department.id, member.id) : undefined}
              isPromoting={pendingAction?.type === "promote" && pendingAction?.employeeId === member.id}
              isRemoving={pendingAction?.type === "remove" && pendingAction?.employeeId === member.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Department column (desktop) ─────────────────────────────────────────────

function DepartmentColumn({ department, idx, total, onMakeHead, onRemoveEmployee, pendingAction }) {
  const color = colorFor(department.colorId);
  return (
    <div className="relative flex w-52 lg:w-64 flex-shrink-0 flex-col items-stretch">
      <div className="relative h-10 w-full">
        {total === 1 ? (
          <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-[#27a9b5]" />
        ) : idx === 0 ? (
          <div className="absolute top-0 bottom-0 left-[-14px] right-1/2 border-t-3 scale-x-[-1] border-l-3 border-[#27a9b5] rounded-tl-2xl" />
        ) : idx === total - 1 ? (
          <div className="absolute top-0 bottom-0 left-1/2 right-[-14px] border-t-3 scale-x-[-1] border-r-3 border-[#27a9b5] rounded-tr-2xl" />
        ) : (
          <>
            <div className="absolute top-0 left-[-12px] right-[-12px] h-[2px] bg-[#27a9b5]" />
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-[#27a9b5]" />
          </>
        )}
        <ChevronDown
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1.5 h-4 w-4 text-[#27a9b5]"
          strokeWidth={3}
        />
      </div>

      <div
        className="rounded-2xl py-2.5 text-center text-sm lg:text-base font-semibold shadow-sm"
        style={{ backgroundColor: color.bg, color: color.text }}
      >
        {department.name}
      </div>

      <div className="relative mt-5 flex flex-col gap-4">
        {department.members.length > 0 && (
          <div className="absolute left-0 top-3 bottom-3 w-px bg-[#27a9b5]/40 h-[calc(100%-60px)]" />
        )}
        {department.members.map((member) => (
          <div key={member.id} className="relative">
            <span
              className="absolute left-0 top-1/2 h-4 w-4 -translate-y-full border-b border-l border-[#27a9b5]/40"
              style={{ borderBottomLeftRadius: 10 }}
            />
            <ChevronDown className="absolute left-2 top-5 -rotate-90 h-4 w-4 text-[#27a9b5]" strokeWidth={3} />
            <div className="ml-6">
              <PersonNode
                name={member.name}
                title={member.title}
                photo={member.photo}
                isHead={member.isHead}
                onMakeHead={onMakeHead ? () => onMakeHead(department.id, member.id) : undefined}
                onRemove={onRemoveEmployee ? () => onRemoveEmployee(department.id, member.id) : undefined}
                isPromoting={pendingAction?.type === "promote" && pendingAction?.employeeId === member.id}
                isRemoving={pendingAction?.type === "remove" && pendingAction?.employeeId === member.id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Single-select for manager ────────────────────────────────────────────────

function ManagerSelect({ employees, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selectedManager = employees.find((emp) => emp.id === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-right text-sm text-foreground hover:border-border"
      >
        {selectedManager ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
              {selectedManager.photo ? (
                <img src={selectedManager.photo} alt={selectedManager.name} className="h-full w-full object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center text-xs font-semibold ${selectedManager.avatarBg} ${selectedManager.avatarColor}`}>
                  {selectedManager.avatar}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="font-medium">{selectedManager.name}</p>
              <p className="text-xs text-muted-foreground">{selectedManager.position}</p>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 left-0 z-30 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-lg">
          {employees.map((emp) => (
            <button
              key={emp.id}
              type="button"
              onClick={() => { onChange(emp.id); setOpen(false); }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${value === emp.id ? "bg-primary/5 font-medium text-primary" : "text-foreground hover:bg-muted"}`}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-muted flex-shrink-0">
                  {emp.photo ? (
                    <img src={emp.photo} alt={emp.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center text-xs font-semibold ${emp.avatarBg} ${emp.avatarColor}`}>
                      {emp.avatar}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.position}</p>
                </div>
              </div>
              {value === emp.id && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Add Element modal ────────────────────────────────────────────────────────



function AddElementModal({ open, onClose, onSubmit, employees, submitting }) {
  const { data: departments = [], isLoading: isLoadingDepartments } = useCrud({
    queryKey: "departments",
    endpoint: "/departments",
  });

  const departmentOptions = useMemo(
    () => (departments ?? []).map((dept) => ({ value: dept, label: dept })),
    [departments]
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      department: "",
      headEmployeeId: "",
      employeeIds: [],
      colorId: DEPARTMENT_COLORS[0].id,
    },
  });

  if (!open) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (values) => {
    await onSubmit({
      department: values.department,
      headEmployeeId: values.headEmployeeId,
      employeeIds: values.employeeIds,
      colorId: values.colorId,
    });
    reset();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center p-3 sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-card shadow-xl max-h-[90vh] overflow-y-auto rounded-3xl p-4 sm:p-6"
      >
        <div className="flex justify-center mb-4 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>

        <div className="flex items-center justify-between border-b border-border pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg font-bold text-foreground">اضافة عنصر جديد</h2>
          <button type="button" onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 sm:space-y-5 pt-4 sm:pt-5">
          {/* DEPARTMENT (select) */}
          <FormInput
            name="department"
            type="select"
            label="القسم"
            className="text-[12px] md:text-md"
            options={departmentOptions}
            disabled={isLoadingDepartments}
            register={register}
            rules={{ required: "القسم مطلوب" }}
            error={errors.department?.message}
            touched={!!errors.department}
          />

          {/* MANAGER */}
          <FormField name="headEmployeeId">
            <FormLabel>المدير المسؤول</FormLabel>
            <Controller
              name="headEmployeeId"
              control={control}
              render={({ field }) => (
                <ManagerSelect
                  employees={employees}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="اختر المدير"
                />
              )}
            />
          </FormField>

          {/* EMPLOYEES */}
          <FormField name="employeeIds">
            <FormLabel>الموظفين</FormLabel>
            <Controller
              name="employeeIds"
              control={control}
              render={({ field }) => (
                <>
                  <EmployeeMultiSelect
                    employees={employees}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="اختر الموظفين"
                  />

                  {field.value.length > 0 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                      {field.value.map((id) => {
                        const employee = employees.find((emp) => emp.id === id);
                        if (!employee) return null;
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-2 rounded-lg border border-[#56ACB9] bg-[#87C7D421] p-2 flex-shrink-0"
                          >
                            <div className="h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full bg-muted">
                              {employee.photo ? (
                                <img src={employee.photo} alt={employee.name} className="h-full w-full object-cover" />
                              ) : (
                                <div
                                  className={`flex h-full w-full items-center justify-center text-[10px] sm:text-xs font-semibold ${employee.avatarBg} ${employee.avatarColor}`}
                                >
                                  {employee.avatar}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">{employee.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{employee.position}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => field.onChange(field.value.filter((mid) => mid !== id))}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            />
          </FormField>

          {/* COLOR */}
          <FormField name="colorId">
            <FormLabel>لون القسم</FormLabel>
            <Controller
              name="colorId"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {DEPARTMENT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => field.onChange(c.id)}
                      className="h-6 w-6 sm:h-7 sm:w-7 rounded-full transition-all ring-offset-2"
                      style={{
                        backgroundColor: c.dot,
                        boxShadow: field.value === c.id ? `0 0 0 2px white, 0 0 0 4px ${c.dot}` : "none",
                      }}
                    >
                      {field.value === c.id && <Check className="h-3 w-3 text-white mx-auto" />}
                    </button>
                  ))}
                </div>
              )}
            />
          </FormField>

          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1 h-10 sm:h-11 text-sm border-border hover:bg-muted"
              onClick={handleClose}
              disabled={submitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 h-10 sm:h-11 text-sm bg-[#4E9DA8] text-white hover:bg-[#4E9DA8]/80"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "اضافة"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Mobile carousel nav ──────────────────────────────────────────────────────

function MobileOrgView({ departments, onAddClick, onMakeHead, onRemoveEmployee, pendingAction }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        {departments.map((dept) => (
          <MobileDepartmentCard
            key={dept.id}
            department={dept}
            onMakeHead={onMakeHead}
            onRemoveEmployee={onRemoveEmployee}
            pendingAction={pendingAction}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 sm:py-3 px-3 sm:px-5 rounded-xl sm:rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors print:hidden"
      >
        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">اضافة قسم</span>
      </button>
    </div>
  );
}

// ─── Main Org Chart ───────────────────────────────────────────────────────────

export default function OrgChart({
  employees = [],
  showAddModal: externalShowAddModal,
  setShowAddModal: externalSetShowAddModal,
}) {
  const [localShowAddModal, setLocalShowAddModal] = useState(false);
  const showAddModal = externalShowAddModal !== undefined ? externalShowAddModal : localShowAddModal;
  const setShowAddModal = externalSetShowAddModal !== undefined ? externalSetShowAddModal : setLocalShowAddModal;

  const {
    departments,
    isLoading,
    addOrUpdateDepartment,
    creating,
    changeDepartmentHead,
    removeEmployeeFromDepartment,
  } = useOrgChartData();

  // لتتبع أنهي زرار بالظبط شغال دلوقتي (عشان الـ spinner يظهر على العنصر الصح فقط)
  const [pendingAction, setPendingAction] = useState(null); // { type: "promote" | "remove", employeeId }

  const handleAddDepartment = async ({ department, headEmployeeId, employeeIds, colorId }) => {
    try {
      await addOrUpdateDepartment({ department, headEmployeeId, employeeIds, color: colorId });
      setShowAddModal(false);
    } catch {
      // الأخطاء بتتعرض تلقائي عن طريق useCrud (toast)
    }
  };

  const handleMakeHead = async (departmentId, employeeId) => {
    setPendingAction({ type: "promote", employeeId });
    try {
      await changeDepartmentHead(departmentId, employeeId);
    } finally {
      setPendingAction(null);
    }
  };

  const handleRemoveEmployee = async (departmentId, employeeId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الموظف من القسم؟")) return;
    setPendingAction({ type: "remove", employeeId });
    try {
      await removeEmployeeFromDepartment(departmentId, employeeId);
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <Card className="rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-lg sm:text-xl font-bold text-foreground">الهيكل التنظيمي</h2>
        <Button
          variant="outline"
          className="gap-2 rounded-md bg-background px-3 sm:px-4 py-2 h-auto text-xs sm:text-sm font-semibold flex items-center transition-all"
          onClick={() => window.print()}
        >
          <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">طباعة</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          {/* ── Mobile view ── */}
          <div className="block md:hidden">
            <div className="rounded-3xl border border-gray-100 bg-[#F4F8F9] p-4 [background-image:radial-gradient(#d9d9d9_1px,transparent_1px)] [background-size:18px_18px]">
              <MobileOrgView
                departments={departments}
                onAddClick={() => setShowAddModal(true)}
                onMakeHead={handleMakeHead}
                onRemoveEmployee={handleRemoveEmployee}
                pendingAction={pendingAction}
              />
            </div>
          </div>

          {/* ── Desktop view ── */}
          <div className="hidden md:block">
            <div className="relative overflow-x-auto rounded-3xl border border-gray-100 bg-[#F4F8F9] p-8 [background-image:radial-gradient(#d9d9d9_1px,transparent_1px)] [background-size:18px_18px]">
              <div className="flex min-w-max flex-col items-center">
                <div className="mt-0 flex items-start gap-4 lg:gap-6 pt-0">
                  {departments.map((dept, idx) => (
                    <DepartmentColumn
                      key={dept.id}
                      department={dept}
                      idx={idx}
                      total={departments.length}
                      onMakeHead={handleMakeHead}
                      onRemoveEmployee={handleRemoveEmployee}
                      pendingAction={pendingAction}
                    />
                  ))}

                  <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="mt-10 flex h-11 w-11 flex-shrink-0 items-center justify-center self-start rounded-full border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary print:hidden transition-colors"
                    aria-label="اضافة قسم"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <AddElementModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddDepartment}
        employees={employees}
        submitting={creating}
      />
    </Card>
  );
}