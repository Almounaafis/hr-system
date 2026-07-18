import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import FormInput from "@/shared/forms/FormInput";
import { MinusCircle, PlusCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

export function AddDeductionAllowanceDialog({ open, onOpenChange, actionType, entries, onAddEntry, onRemoveEntry, onSubmit, selectedMonth, selectedYear, isCreating }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      type: "",
      amount: "",
      reason: ""
    }
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const handleAddEntry = (data) => {
    onAddEntry(data);
    reset();
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {actionType === "deduction" ? "إضافة خصم" : "إضافة مكافأة"}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4 py-4" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Month/Year Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">الشهر</label>
              <div className="px-3 py-2 border rounded-lg bg-muted">
                {selectedMonth}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">السنة</label>
              <div className="px-3 py-2 border rounded-lg bg-muted">
                {selectedYear}
              </div>
            </div>
          </div>
          <FormInput
            name="type"
            label={actionType === "deduction" ? "نوع الخصم" : "نوع المكافأة"}
            type="select"
            register={register}
            placeholder="اختر النوع"
            rules={{ required: "هذا الحقل مطلوب" }}
            error={errors.type?.message}
              options={
                actionType === "deduction"
                  ? [
                    { value: "late", label: "تأخير" },
                    { value: "absence", label: "غياب" },
                    { value: "penalty", label: "غرامة" },
                    { value: "other", label: "أخرى" }
                  ]
                  : [
                    { value: "bonus", label: "مكافأة أداء" },
                    { value: "overtime", label: "ساعات إضافية" },
                    { value: "project", label: "مكافأة مشروع" },
                    { value: "other", label: "أخرى" }
                  ]
              }
            />
            <FormInput
              name="amount"
              label="المبلغ"
              type="number"
              placeholder="أدخل المبلغ"
              register={register}
              rules={{ required: "هذا الحقل مطلوب" }}
              error={errors.amount?.message}
            />
            <FormInput
              name="reason"
              label="السبب"
              type="text"
              placeholder="أدخل السبب"
              register={register}
              rules={{ required: "هذا الحقل مطلوب" }}
              error={errors.reason?.message}
            />
            <button
              type="button"
              onClick={handleSubmit(handleAddEntry)}
              className="text-sm text-primary flex items-center gap-2 cursor-pointer"
            >
              <PlusCircleIcon />
              إضافة {actionType === "deduction" ? "خصومات اخرى" : "مكافأة اخرى"}
            </button>

            {entries.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {actionType === "deduction" ? "الخصومات المضافة" : "المكافآت المضافة"}
                </p>
                {entries.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {actionType === "deduction"
                          ? ["late", "absence", "penalty", "other"].includes(entry.type)
                            ? { late: "تأخير", absence: "غياب", penalty: "غرامة", other: "أخرى" }[entry.type]
                            : entry.type
                          : ["bonus", "overtime", "project", "other"].includes(entry.type)
                            ? { bonus: "مكافأة أداء", overtime: "ساعات إضافية", project: "مكافأة مشروع", other: "أخرى" }[entry.type]
                            : entry.type}
                      </p>
                      <p className="text-muted-foreground">{entry.reason} - {entry.amount} EGP</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveEntry(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <MinusCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <DialogFooter className="gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                disabled={isCreating}
              >
                {isCreating ? "جاري الإضافة..." : "إضافة"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onOpenChange}
                className="flex-1"
              >
                إلغاء
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}
