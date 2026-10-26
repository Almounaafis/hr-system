// @/features/trainees/TraineesPage.jsx
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/Pagination";
import FormInput from "@/components/shared/forms/FormInput";
import { useForm } from "react-hook-form";
import { useTrainees, useCreateTrainee } from "@/features/trainees/hooks/useTrainees";
import TraineesTable from "@/features/trainees/TraineesTable";
import TraineeDetailSheet from "@/features/trainees/TraineeDetailSheet";

// ─── Create Modal ────────────────────────────────────────────────────────────
function CreateTraineeModal({ open, onClose, onSubmit, submitting }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div dir="rtl" className="w-full sm:max-w-lg bg-card rounded-3xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 border-b pb-2">إضافة متدرب جديد</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput name="full_name" label="الاسم الكامل" register={register} rules={{ required: "مطلوب" }} error={errors.full_name?.message} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="email" type="email" label="البريد الإلكتروني" register={register} />
            <FormInput name="phone" label="رقم الهاتف" register={register} />
          </div>
          <FormInput name="position" label="القسم / الوظيفة" register={register} />
          
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="start_date" type="date" label="تاريخ البداية" register={register} rules={{ required: "مطلوب" }} error={errors.start_date?.message} />
            <FormInput name="end_date" type="date" label="تاريخ النهاية (اختياري)" register={register} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="duration_weeks" type="number" label="المدة بالأسابيع" register={register} />
            <FormInput name="monthly_stipend" type="number" label="المكافأة الشهرية" register={register} />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">إلغاء</Button>
            <Button type="submit" disabled={submitting} className="flex-1 bg-[#4E9DA8] text-white">حفظ</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function TraineesPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { trainees, pagination, isLoading, isError, refetch } = useTrainees({ page, limit });
  const { createTrainee, isCreating } = useCreateTrainee();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTraineeId, setSelectedTraineeId] = useState(null);

  const handleCreate = async (data) => {
    await createTrainee({
      ...data,
      duration_weeks: data.duration_weeks ? Number(data.duration_weeks) : undefined,
      monthly_stipend: data.monthly_stipend ? Number(data.monthly_stipend) : undefined,
    });
    setIsCreateOpen(false);
  };

  return (
    <div dir="rtl" className="space-y-6 p-2 sm:p-1">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">إدارة المتدربين</h1>
          <p className="text-sm text-muted-foreground mt-1">تسجيل حضور المتدربين وتقييمهم وتخريجهم.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> إضافة متدرب
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold">قائمة المتدربين</h2>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            {isLoading || isError ? "—" : pagination.total}
          </span>
        </div>

        <TraineesTable
          trainees={trainees}
          isLoading={isLoading}
          isError={isError}
          onView={setSelectedTraineeId}
          onRetry={refetch}
          skeletonRows={limit}
        />

        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center sm:justify-end">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.total}
              pageSize={limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <CreateTraineeModal 
        open={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={handleCreate} 
        submitting={isCreating} 
      />

      <TraineeDetailSheet
        traineeId={selectedTraineeId}
        onClose={() => setSelectedTraineeId(null)}
      />
    </div>
  );
}