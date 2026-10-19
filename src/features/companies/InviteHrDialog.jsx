// @/features/companies/InviteHrDialog.jsx
import { useEffect } from "react";
import { X, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/forms/FormInput";

/**
 * Small dialog to invite an HR/accountant to a company.
 * Posts { email } to /auth/invite-hr/{companyId}.
 */
export default function InviteHrDialog({
  open,
  onClose,
  company,
  onSubmit,
  submitting = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { email: "" } });

  useEffect(() => {
    if (open) reset({ email: "" });
  }, [open, reset]);

  if (!open) return null;

  const handleClose = () => {
    if (submitting) return;
    onClose?.();
  };

  const submit = async (values) => {
    await onSubmit?.(values.email);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-card shadow-xl rounded-t-3xl sm:rounded-3xl p-4 sm:p-6"
      >
        <div className="flex justify-center mb-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>

        <div className="flex items-center justify-between border-b border-border pb-3 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#EAF4F5] text-primary">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                إضافة محاسب
              </h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                {company?.name || "الشركة"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
            disabled={submitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4 pt-4 sm:pt-5">
          <FormInput
            name="email"
            type="email"
            label="البريد الإلكتروني"
            register={register}
            rules={{
              required: "البريد الإلكتروني مطلوب",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "بريد إلكتروني غير صالح",
              },
            }}
            error={errors.email?.message}
            touched={!!errors.email}
            placeholder="accountant@company.com"
            className="text-sm"
          />

          <p className="text-xs text-muted-foreground">
            سيتم إرسال دعوة إلى هذا البريد للانضمام كمحاسب لهذه الشركة.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1 h-10 sm:h-11"
              onClick={handleClose}
              disabled={submitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 h-10 sm:h-11 bg-[#4E9DA8] text-white hover:bg-[#4E9DA8]/80"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "إرسال الدعوة"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}