// @/features/companies/CompanyModal.jsx
import { useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, FormLabel } from "@/components/ui/form-field";
import {
  TagListField,
  ImagePickerField,
  TextField,
  SelectField,
} from "./CompanyFormFields";
import {
  TIMEZONE_OPTIONS,
  DEFAULT_TIMEZONE,
} from "./constants";

const EMPTY = {
  name: "",
  type: "",
  branches: [],
  departments: [],
  timezone: DEFAULT_TIMEZONE,
  logo: null,
  stamp: null,
};

export default function CompanyModal({
  open,
  onClose,
  onSubmit,
  editingCompany = null,
  submitting = false,
}) {
  const isEdit = !!editingCompany;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: EMPTY });

  // Sync defaults when opening / switching between edit/create
  useEffect(() => {
    if (!open) return;
    if (editingCompany) {
      reset({
        name: editingCompany.name || "",
        type: editingCompany.type || "",
        branches: Array.isArray(editingCompany.branches) ? editingCompany.branches : [],
        departments: Array.isArray(editingCompany.departments) ? editingCompany.departments : [],
        timezone: editingCompany.timezone || DEFAULT_TIMEZONE,
        logo: null,
        stamp: null,
      });
    } else {
      reset(EMPTY);
    }
  }, [open, editingCompany, reset]);

  if (!open) return null;

  const handleClose = () => {
    if (submitting) return;
    onClose?.();
  };

  const submit = async (values) => {
    await onSubmit?.(values);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-xl bg-card shadow-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-4 sm:p-6"
      >
        {/* Mobile handle */}
        <div className="flex justify-center mb-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            {isEdit ? "تعديل الشركة" : "إضافة شركة جديدة"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
            disabled={submitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submit)} className="space-y-4 sm:space-y-5 pt-4 sm:pt-5">
          <TextField
            name="name"
            label="اسم الشركة"
            register={register}
            rules={{ required: "اسم الشركة مطلوب" }}
            error={errors.name?.message}
            placeholder="مثال: شركة ذهاب و عودة"
          />

          <TextField
            name="type"
            label="نوع الشركة"
            register={register}
            rules={{ required: "نوع الشركة مطلوب" }}
            error={errors.type?.message}
            placeholder="مثال: سفر و سياحة"
          />

          <SelectField
            name="timezone"
            label="المنطقة الزمنية"
            register={register}
            rules={{ required: "المنطقة الزمنية مطلوبة" }}
            error={errors.timezone?.message}
            options={TIMEZONE_OPTIONS}
          />

          {/* Branches */}
          <FormField name="branches">
            <Controller
              name="branches"
              control={control}
              render={({ field }) => (
                <TagListField
                  label="الفروع"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="أضف فرع ثم اضغط Enter"
                />
              )}
            />
          </FormField>

          {/* Departments */}
          <FormField name="departments">
            <Controller
              name="departments"
              control={control}
              render={({ field }) => (
                <TagListField
                  label="الأقسام"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="أضف قسم ثم اضغط Enter"
                />
              )}
            />
          </FormField>

          {/* Logo & Stamp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="logo"
              control={control}
              render={({ field }) => (
                <ImagePickerField
                  label="شعار الشركة"
                  value={field.value}
                  onChange={field.onChange}
                  existingUrl={editingCompany?.logo_url}
                />
              )}
            />
            <Controller
              name="stamp"
              control={control}
              render={({ field }) => (
                <ImagePickerField
                  label="ختم الشركة"
                  value={field.value}
                  onChange={field.onChange}
                  existingUrl={editingCompany?.stamp_url}
                />
              )}
            />
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
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
              ) : isEdit ? (
                "حفظ التغييرات"
              ) : (
                "إضافة"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}