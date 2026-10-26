// @/features/recruitment/PositionModal.jsx
import { useEffect } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/forms/FormInput";
import { useCrud } from "@/hooks/useCrud";

const EMPTY = {
  title: "",
  department: "",
  description: "",
  requirements: "",
  status: "open",
  custom_fields: [],
};

const FIELD_TYPES = [
  { value: "text", label: "نص (Text)" },
  { value: "number", label: "رقم (Number)" },
  { value: "boolean", label: "صح/خطأ (Boolean)" },
  { value: "select", label: "قائمة منسدلة (Select)" },
];

export default function PositionModal({ open, onClose, onSubmit, editingPosition, submitting }) {
  const isEdit = !!editingPosition;

  // 1. Fetch Departments
  const { data: departmentsData, isLoading: isLoadingDepartments } = useCrud({
    queryKey: ["departments"],
    endpoint: "/departments",
    enabled: open,
  });

  const departments = departmentsData?.data || departmentsData || [];
  const departmentOptions = departments.map((dept) => ({
    value: dept,
    label: dept,
  }));

  // 2. Form Setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: EMPTY,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "custom_fields",
  });

  // Watch the custom_fields to conditionally render the Options input
  const watchedCustomFields = watch("custom_fields");

  // 3. Sync Data on Open
  useEffect(() => {
    if (!open) return;

    if (editingPosition) {
      const mappedCustomFields = (editingPosition.custom_fields || []).map((f) => ({
        field_name: f.field_name,
        label: f.label,
        type: f.type || "text", // Defaults to text if somehow missing
        required: Boolean(f.required),
        options_text: Array.isArray(f.options) ? f.options.join(", ") : "",
      }));

      reset({
        title: editingPosition.title || "",
        department: editingPosition.department || "",
        description: editingPosition.description || "",
        requirements: editingPosition.requirements || "",
        status: editingPosition.status || "open",
        custom_fields: mappedCustomFields,
      });
    } else {
      reset(EMPTY);
    }
  }, [open, editingPosition, reset]);

  // 4. Intercept Submit to generate field_name automatically
  const handleFormSubmit = (values) => {
    const processedCustomFields = values.custom_fields.map((field) => {
      let finalFieldName = field.field_name;

      if (!finalFieldName && field.label) {
        finalFieldName = field.label
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^\w\u0621-\u064A]/g, "");

        if (!finalFieldName) {
          finalFieldName = `field_${Date.now()}`;
        }
      }

      // Clean up options if it's not a select type
      const options = field.type === "select" && field.options_text
        ? field.options_text.split(",").map(s => s.trim()).filter(Boolean)
        : [];

      return {
        ...field,
        field_name: finalFieldName,
        options,
      };
    });

    onSubmit({ ...values, custom_fields: processedCustomFields });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={() => !submitting && onClose?.()}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl bg-card shadow-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-4 sm:p-6"
      >
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? "تعديل الوظيفة" : "إضافة وظيفة جديدة"}
          </h2>
          <button
            onClick={() => !submitting && onClose?.()}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              name="title"
              label="المسمى الوظيفي"
              register={register}
              rules={{ required: "مطلوب" }}
              error={errors.title?.message}
            />

            <FormInput
              name="department"
              type="select"
              label="القسم"
              register={register}
              rules={{ required: "مطلوب" }}
              error={errors.department?.message}
              options={departmentOptions}
              disabled={isLoadingDepartments}
              placeholder={isLoadingDepartments ? "جاري التحميل..." : "اختر القسم"}
            />
          </div>

          <FormInput
            name="description"
            type="textarea"
            label="الوصف"
            register={register}
            rows={3}
          />
          <FormInput
            name="requirements"
            type="textarea"
            label="المتطلبات"
            register={register}
            rows={3}
          />

          {/* Custom Fields Builder */}
          <div className="border-t border-border pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                حقول مخصصة (Custom Fields)
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    field_name: "",
                    label: "",
                    type: "text", // Provide a default type explicitly
                    required: false,
                    options_text: "",
                  })
                }
                className="gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> إضافة حقل
              </Button>
            </div>

            {fields.map((field, index) => {
              // We watch the type value for this specific row to conditionally show the Options input
              const currentType = watchedCustomFields?.[index]?.type;

              return (
                <div
                  key={field.id}
                  className="flex flex-col gap-2 p-3 mb-2 border border-border rounded-lg bg-muted/30 relative"
                >
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 left-2 text-destructive hover:bg-red-50 p-1 rounded-md"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <FormInput
                      name={`custom_fields.${index}.label`}
                      label="الاسم الظاهر (مثال: سنوات الخبرة)"
                      register={register}
                      rules={{ required: "مطلوب" }}
                      error={errors.custom_fields?.[index]?.label?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Using Controller here ensures the Select updates correctly when data is reset */}
                    <Controller
                      name={`custom_fields.${index}.type`}
                      control={control}
                      defaultValue="text"
                      render={({ field: { onChange, value } }) => (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-medium text-foreground">النوع</label>
                          <select
                            value={value || "text"}
                            onChange={onChange}
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          >
                            {FIELD_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    />

                    <div className="flex items-center gap-2 mt-6">
                      <input
                        type="checkbox"
                        id={`req-${index}`}
                        {...register(`custom_fields.${index}.required`)}
                        className="rounded border-border w-4 h-4"
                      />
                      <label htmlFor={`req-${index}`} className="text-sm">
                        حقل مطلوب
                      </label>
                    </div>
                  </div>

                  {/* Options (Only for select type) */}
                  {currentType === "select" && (
                    <div className="mt-1">
                      <label className="text-xs text-muted-foreground">
                        خيارات (مفصولة بفاصلة)
                      </label>
                      <input
                        type="text"
                        placeholder="Option 1, Option 2"
                        {...register(`custom_fields.${index}.options_text`)}
                        className="w-full mt-1 rounded-lg border border-border px-3 py-2 text-sm"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 sm:gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => !submitting && onClose?.()}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#4E9DA8] hover:bg-[#4E9DA8]/80 text-white"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}