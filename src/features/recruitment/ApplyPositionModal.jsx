// @/features/recruitment/ApplyPositionModal.jsx
import { useEffect } from "react";
import { X, Loader2, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/forms/FormInput";
import { usePublicPosition, useApplyToPosition } from "./hooks/usePositions";
import { Skeleton } from "@/components/skeletons/RequestsSkeltons";

export default function ApplyPositionModal({ open, onClose, positionId }) {
  const { position, isLoading } = usePublicPosition(open ? positionId : null);
  const { apply, isApplying } = useApplyToPosition();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (open) reset({});
  }, [open, reset]);

  if (!open) return null;

  const onSubmit = async (values) => {
    // Parse custom fields into an object
    const customFieldsData = {};
    if (position?.custom_fields) {
      position.custom_fields.forEach((field) => {
        customFieldsData[field.field_name] = values[`cf_${field.field_name}`];
      });
    }

    await apply({
      position,
      formData: {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        extra_data: values.extra_data,
        custom_fields: customFieldsData,
      },
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-0 sm:p-4" onClick={() => !isApplying && onClose?.()}>
      <div dir="rtl" onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-lg bg-card shadow-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6">
        
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">التقديم على وظيفة</h2>
            <p className="text-sm text-primary">{position?.title || "جاري التحميل..."}</p>
          </div>
          <button onClick={() => !isApplying && onClose?.()} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput name="full_name" label="الاسم الكامل" register={register} rules={{ required: "مطلوب" }} error={errors.full_name?.message} />
            <FormInput name="email" type="email" label="البريد الإلكتروني" register={register} rules={{ required: "مطلوب" }} error={errors.email?.message} />
            <FormInput name="phone" label="رقم الهاتف" register={register} />
            
            {/* Dynamic Custom Fields */}
            {position?.custom_fields?.map((field) => {
              const fieldName = `cf_${field.field_name}`;
              
              if (field.type === "select") {
                return (
                  <FormInput
                    key={field.field_name}
                    name={fieldName}
                    type="select"
                    label={field.label}
                    options={field.options?.map(o => ({ value: o, label: o })) || []}
                    register={register}
                    rules={{ required: field.required ? "هذا الحقل مطلوب" : false }}
                    error={errors[fieldName]?.message}
                  />
                );
              }

              if (field.type === "boolean") {
                return (
                  <div key={field.field_name} className="flex items-center gap-2">
                    <input type="checkbox" id={fieldName} {...register(fieldName)} className="rounded border-border" />
                    <label htmlFor={fieldName} className="text-sm">{field.label}</label>
                  </div>
                );
              }

              return (
                <FormInput
                  key={field.field_name}
                  name={fieldName}
                  type={field.type === "number" ? "number" : "text"}
                  label={field.label}
                  register={register}
                  rules={{ required: field.required ? "هذا الحقل مطلوب" : false }}
                  error={errors[fieldName]?.message}
                />
              );
            })}

            <FormInput name="extra_data" type="textarea" label="ملاحظات إضافية / تعليقات" register={register} rows={3} />

            <Button type="submit" className="w-full bg-[#4E9DA8] hover:bg-[#4E9DA8]/80 text-white h-11" disabled={isApplying}>
              {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : "إرسال الطلب"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}