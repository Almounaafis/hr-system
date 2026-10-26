// @/features/custodies/CustodyModals.jsx
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form"; // 👈 Added Controller
import { useQuery } from "@tanstack/react-query"; // 👈 Added useQuery
import api from "@/lib/axios"; // 👈 Imported api
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/forms/FormInput";
import { DateInput } from "@/components/ui/date-input";

// ─── 1. Create / Edit Modal ──────────────────────────────────────────────────
export function CustodyFormModal({ open, onClose, onSubmit, editingCustody, submitting }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const category = watch("category", "laptop");
  const status = watch("status", "available");
  const condition = watch("condition", "good");
  
  useEffect(() => {
    if (open) {
      if (editingCustody) {
        reset({
          name: editingCustody.name || "",
          category: editingCustody.category || "laptop",
          status: editingCustody.status || "available",
          serial_number: editingCustody.serial_number || "",
          brand: editingCustody.brand || "",
          model: editingCustody.model || "",
          condition: editingCustody.condition || "good",
          purchase_date: editingCustody.purchase_date ? editingCustody.purchase_date.split("T")[0] : "",
          cost: editingCustody.cost || "",
          notes: editingCustody.notes || "",
        });
      } else {
        reset({
          name: "",
          category: "laptop",
          status: "available",
          condition: "good",
          serial_number: "",
          brand: "",
          model: "",
          purchase_date: "",
          cost: "",
          notes: "",
        });
      }
    }
  }, [open, editingCustody, reset]);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !submitting && onClose?.()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto z-[60]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{editingCustody ? "تعديل العهدة" : "إضافة عهدة جديدة"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput name="name" label="اسم العهدة" register={register} rules={{ required: "مطلوب" }} error={errors.name?.message} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput 
              name="category" 
              type="select" 
              label="الفئة" 
              register={register} 
              value={category}
              onChange={(e) => setValue("category", e?.target ? e.target.value : e)}
              options={[
                { value: "laptop", label: "لابتوب" }, { value: "phone", label: "هاتف" }, { value: "accessory", label: "ملحقات" }, { value: "other", label: "أخرى" }
              ]} 
            />
            <FormInput 
              name="status" 
              type="select" 
              label="الحالة" 
              register={register} 
              value={status}
              onChange={(e) => setValue("status", e?.target ? e.target.value : e)}
              options={[
                { value: "available", label: "متاح" }, { value: "assigned", label: "مُعين" }, { value: "maintenance", label: "صيانة" }, { value: "damaged", label: "تالف" }
              ]} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="serial_number" label="الرقم التسلسلي" register={register} />
            <FormInput name="brand" label="الماركة" register={register} />
          </div>
          <FormInput name="model" label="الموديل" register={register} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput 
              name="condition" 
              type="select" 
              label="الحالة الفنية" 
              register={register} 
              value={condition}
              onChange={(e) => setValue("condition", e?.target ? e.target.value : e)}
              options={[
                { value: "new", label: "جديد" }, { value: "good", label: "جيد" }, { value: "fair", label: "مقبول" }, { value: "poor", label: "سيئ" }
              ]} 
            /> 
            <DateInput
              label="تاريخ الشراء "
              value={watch("purchase_date") || ""}
              onChange={(e) => setValue("purchase_date", e.target.value, { shouldValidate: true })}
            />
          </div>
          <FormInput name="cost" type="number" label="التكلفة" register={register} />
          <FormInput name="notes" type="textarea" label="ملاحظات" register={register} rows={2} />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">إلغاء</Button>
            <Button type="submit" disabled={submitting} className="flex-1 bg-[#4E9DA8]">
              {submitting && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              حفظ
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── 2. Action Modal (Assign / Transfer) ─────────────────────────────────────
export function CustodyActionModal({ open, onClose, onSubmit, type, custodyId, submitting }) {
  const isAssign = type === "assign";
  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm();
  
  const typeFieldName = isAssign ? "assigned_to_type" : "new_assigned_to_type";
  const assignedToType = watch(typeFieldName, "employee");

  // 👇 Fetch Employees
  const { data: employeesData, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["employees-for-custody"],
    queryFn: async () => {
      const res = await api.get("/employees");
      return res.data;
    },
    enabled: open && assignedToType === "employee",
  });

  // 👇 Fetch Trainees
  const { data: traineesData, isLoading: isLoadingTrainees } = useQuery({
    queryKey: ["trainees-for-custody"],
    queryFn: async () => {
      const res = await api.get("/trainees");
      return res.data;
    },
    enabled: open && assignedToType === "trainee",
  });

  // Extract arrays safely
  const employees = Array.isArray(employeesData?.data) ? employeesData.data : employeesData?.data?.data || [];
  const trainees = Array.isArray(traineesData?.data?.trainees) ? traineesData.data.trainees : traineesData?.data || [];

  useEffect(() => {
    if (open) {
      if (isAssign) {
        reset({
          assigned_to_type: "employee",
          assigned_date: new Date().toISOString().split("T")[0],
          user_id: "",
          trainee_id: "",
          condition_on_handover: "",
          notes: "",
        });
      } else {
        reset({
          new_assigned_to_type: "employee",
          transfer_date: new Date().toISOString().split("T")[0],
          new_user_id: "",
          new_trainee_id: "",
          condition_on_handover: "",
          notes: "",
        });
      }
    }
  }, [open, isAssign, reset]);

  // Determine the dynamic field name based on type and action
  const idFieldName = isAssign
    ? (assignedToType === "employee" ? "user_id" : "trainee_id")
    : (assignedToType === "employee" ? "new_user_id" : "new_trainee_id");

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !submitting && onClose?.()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto z-[60]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{isAssign ? "تعيين العهدة" : "نقل العهدة"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <FormInput 
            name={typeFieldName} 
            type="select" 
            label={isAssign ? "نوع المستلم" : "نوع المستلم الجديد"} 
            register={register} 
            rules={{
              required: isAssign
                ? "نوع المستلم مطلوب"
                : "نوع المستلم الجديد يجب أن يكون إما employee أو trainee"
            }}
            error={errors[typeFieldName]?.message}
            value={assignedToType}
            onChange={(e) => {
              setValue(typeFieldName, e?.target ? e.target.value : e);
              setValue(idFieldName, ""); // Reset the ID selection when type changes
            }}
            options={[
              { value: "employee", label: "موظف" }, 
              { value: "trainee", label: "متدرب" }
            ]} 
          />

          {/* 👇 Dynamic Select Dropdown for Employee or Trainee */}
          <Controller
            name={idFieldName}
            control={control}
            rules={{ required: "مطلوب" }}
            render={({ field }) => {
              const isLoading = assignedToType === "employee" ? isLoadingEmployees : isLoadingTrainees;
              
              const options = assignedToType === "employee"
                ? employees.map(emp => ({ value: emp.id, label: `${emp.name} (${emp.employee_code || emp.id.substring(0, 8)})` }))
                : trainees.map(trn => ({ value: trn.id, label: `${trn.full_name} (${trn.position || "متدرب"})` }));

              return (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">
                    {isAssign ? "اختر المستلم" : "اختر المستلم الجديد"}
                  </label>
                  <select
                    {...field}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="" disabled>
                      {isLoading ? "جاري تحميل القائمة..." : "اختر من القائمة"}
                    </option>
                    {options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors[idFieldName] && (
                    <span className="text-xs text-destructive">{errors[idFieldName]?.message}</span>
                  )}
                </div>
              );
            }}
          />

          <FormInput 
            name={isAssign ? "assigned_date" : "transfer_date"} 
            type="date" 
            label={isAssign ? "تاريخ التعيين" : "تاريخ النقل"} 
            register={register} 
            rules={{ required: "مطلوب" }} 
          />

          <FormInput name="condition_on_handover" label="الحالة عند التسليم" register={register} placeholder="مثال: جديد، مستعمل بحالة جيدة" />
          
          <FormInput 
            name="notes" 
            label="ملاحظات" 
            type="textarea" 
            register={register} 
            rows={2} 
            placeholder={isAssign ? "" : "ملاحظات النقل"} 
          />

          <div>
            <label className="text-sm font-medium mb-1 block">المستند (اختياري)</label>
            <input type="file" {...register("document")} className="w-full text-sm border border-border rounded-lg p-2 bg-background" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">إلغاء</Button>
            <Button type="submit" disabled={submitting} className="flex-1 bg-[#4E9DA8]">
              {submitting && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              {isAssign ? "تعيين" : "نقل"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── 3. Return Modal ─────────────────────────────────────────────────────────
export function CustodyReturnModal({ open, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const nextStatus = watch("next_status", "available");

  useEffect(() => {
    if (open) reset({ returned_date: new Date().toISOString().split("T")[0], next_status: "available" });
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={(val) => !val && !submitting && onClose?.()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto z-[60]" dir="rtl">
        <DialogHeader>
          <DialogTitle>إرجاع العهدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput name="returned_date" type="date" label="تاريخ الإرجاع" register={register} rules={{ required: "مطلوب" }} />
          <FormInput 
            name="next_status" 
            type="select" 
            label="حالة العهدة بعد الإرجاع" 
            register={register} 
            value={nextStatus}
            onChange={(e) => setValue("next_status", e?.target ? e.target.value : e)}
            options={[
              { value: "available", label: "متاح (جاهز للتعيين)" }, 
              { value: "maintenance", label: "صيانة" }, 
              { value: "damaged", label: "تالف" }
            ]} 
          />
          <FormInput name="condition_on_return" label="الحالة عند الإرجاع" register={register} placeholder="مثال: بحالة جيدة، يوجد خدش بسيط" />
          <FormInput name="notes" type="textarea" label="ملاحظات" register={register} rows={2} />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">إلغاء</Button>
            <Button type="submit" disabled={submitting} className="flex-1 bg-[#4E9DA8]">
              {submitting && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              تأكيد الإرجاع
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}