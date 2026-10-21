// @/features/companies/InviteHrDialog.jsx
import { useEffect } from "react";
import { X, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/forms/FormInput";

export default function InviteHrDialog({ open, onClose, company, onSubmit, submitting , title }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { email: "" } });

  useEffect(() => {
    if (open) reset({ email: "" });
  }, [open, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !submitting && onClose?.()}>
      <div dir="rtl" onClick={(e) => e.stopPropagation()} className="w-full sm:max-w-md bg-card shadow-xl rounded-3xl p-6">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#EAF4F5] text-primary"><Mail className="h-5 w-5" /></div>
            <div>
              <h2 className="text-lg font-bold text-foreground">  {title}  </h2>
              <p className="text-xs text-muted-foreground">{company?.name}</p>
            </div>
          </div>
          <button onClick={() => !submitting && onClose?.()} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((v) => onSubmit?.(v.email))} className="space-y-4">
          <FormInput
            name="email"
            type="email"
            label="البريد الإلكتروني"
            register={register}
            rules={{
              required: "البريد الإلكتروني مطلوب",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "بريد إلكتروني غير صالح" }
            }}
            error={errors.email?.message}
            touched={!!errors.email}
            placeholder="accountant@company.com"
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => !submitting && onClose?.()} disabled={submitting}>
              إلغاء
            </Button>
            <Button type="submit" className="flex-1 bg-[#4E9DA8] hover:bg-[#4E9DA8]/80 text-white" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "إرسال الدعوة"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}