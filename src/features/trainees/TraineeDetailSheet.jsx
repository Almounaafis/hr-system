// @/features/trainees/TraineeDetailSheet.jsx
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { X, User, CalendarCheck, GraduationCap, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/forms/FormInput";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { 
  useTrainee, 
  useUpdateTrainee, 
  useGraduateTrainee, 
  useTraineeAttendance, 
  useRecordAttendance, 
  useUpdateAttendance 
} from "./hooks/useTrainees";

// ─── Attendance Tab ──────────────────────────────────────────────────────────
function AttendanceTab({ traineeId }) {
  const { attendance, isLoading } = useTraineeAttendance(traineeId);
  const { recordAttendance, isRecording } = useRecordAttendance();
  const { updateAttendance, isUpdatingAttendance } = useUpdateAttendance();
  
  const { register, handleSubmit, reset } = useForm();
  const [editingId, setEditingId] = useState(null);

  const handleRecord = async (data) => {
    await recordAttendance({
      trainee_id: traineeId,
      attendance_date: data.attendance_date,
      clock_in: data.clock_in ? `${data.attendance_date}T${data.clock_in}:00` : undefined,
      clock_out: data.clock_out ? `${data.attendance_date}T${data.clock_out}:00` : undefined,
      status: data.status,
    });
    reset();
  };

  const handleUpdate = async (data) => {
    await updateAttendance({
      id: editingId,
      traineeId,
      data: { status: data.status, supervisor_notes: data.supervisor_notes }
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Record New Attendance */}
      <form onSubmit={handleSubmit(handleRecord)} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
        <h4 className="text-sm font-semibold">تسجيل حضور جديد</h4>
        <div className="grid grid-cols-2 gap-2">
          <input type="date" {...register("attendance_date")} className="border p-2 rounded-lg text-sm" required />
          <select {...register("status")} className="border p-2 rounded-lg text-sm" required>
            <option value="present">حاضر</option>
            <option value="late">متأخر</option>
            <option value="absent">غائب</option>
            <option value="excused">بعذر</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input type="time" {...register("clock_in")} className="border p-2 rounded-lg text-sm" />
          <input type="time" {...register("clock_out")} className="border p-2 rounded-lg text-sm" />
        </div>
        <Button type="submit" size="sm" disabled={isRecording} className="w-full bg-[#4E9DA8]">تسجيل</Button>
      </form>

      {/* Attendance List */}
      <div className="space-y-2">
        {isLoading ? <p className="text-center text-sm py-4">جاري التحميل...</p> : 
         attendance.map(att => (
          <div key={att.id} className="p-3 border rounded-lg flex justify-between items-center text-sm">
            <div>
              <p className="font-semibold">{format(parseISO(att.attendance_date), "d MMM yyyy", { locale: arSA })}</p>
              <p className="text-xs text-muted-foreground">{att.clock_in?.substring(11,16) || "—"} - {att.clock_out?.substring(11,16) || "—"}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="secondary" className={att.status === "present" ? "bg-emerald-50" : "bg-amber-50"}>{att.status}</Badge>
              <button onClick={() => setEditingId(att.id)} className="text-xs text-primary underline">تعديل</button>
            </div>
          </div>
        ))}
      </div>

      {/* Update Attendance Modal (Inline) */}
      {editingId && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit(handleUpdate)} className="bg-card p-4 rounded-xl w-full max-w-sm space-y-3">
             <h4 className="font-semibold text-sm">تعديل الحضور</h4>
             <select {...register("status")} className="border p-2 w-full rounded-lg text-sm">
                <option value="present">حاضر</option>
                <option value="late">متأخر</option>
                <option value="absent">غائب</option>
                <option value="excused">بعذر</option>
             </select>
             <textarea {...register("supervisor_notes")} placeholder="ملاحظات المشرف..." className="border p-2 w-full rounded-lg text-sm" rows={2}></textarea>
             <div className="flex gap-2">
               <Button type="button" variant="outline" onClick={() => setEditingId(null)} className="flex-1">إلغاء</Button>
               <Button type="submit" disabled={isUpdatingAttendance} className="flex-1">حفظ</Button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── Main Detail Sheet ───────────────────────────────────────────────────────
export default function TraineeDetailSheet({ traineeId, onClose }) {
  const { trainee, isLoading, refetch } = useTrainee(traineeId);
  const { updateTrainee, isUpdating } = useUpdateTrainee();
  const { graduateTrainee, isGraduating } = useGraduateTrainee();

  const [activeTab, setActiveTab] = useState("details");
  const [isGradMode, setIsGradMode] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!traineeId) return null;

  const handleUpdate = async (data) => {
    await updateTrainee({ id: traineeId, data: {
      ...data,
      monthly_stipend: data.monthly_stipend ? Number(data.monthly_stipend) : undefined,
      duration_weeks: data.duration_weeks ? Number(data.duration_weeks) : undefined,
    }});
    refetch();
  };

  const handleGraduate = async (data) => {
    await graduateTrainee({ id: traineeId, data: {
      salary: Number(data.salary),
      branch: data.branch,
      employment_type: data.employment_type,
      department: data.department,
      hire_date: data.hire_date,
      address: data.address,
      national_id: data.national_id,
      birth_date: data.birth_date,
    }});
    onClose();
  };

  return (
    <Sheet open={!!traineeId} onOpenChange={onClose} side="left">
      <SheetContent className="!max-w-full sm:!max-w-[600px] w-full overflow-y-auto p-0">
        <SheetTitle className="sr-only">تفاصيل المتدرب</SheetTitle>
        
        {isLoading ? <div className="p-6 text-center">جاري التحميل...</div> : !trainee ? null : (
          <div className="pb-10">
            <div className="bg-gradient-to-r from-[#E8F5F3] to-[#F0F9FF] px-6 py-8 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{trainee.full_name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{trainee.position || "بدون قسم"}</p>
              </div>
              <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm"><X className="h-4 w-4" /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b px-6 pt-4">
              <button onClick={() => setActiveTab("details")} className={`pb-3 px-4 text-sm font-medium border-b-2 ${activeTab === "details" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
                <User className="inline h-4 w-4 mr-1"/> البيانات
              </button>
              <button onClick={() => setActiveTab("attendance")} className={`pb-3 px-4 text-sm font-medium border-b-2 ${activeTab === "attendance" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
                <CalendarCheck className="inline h-4 w-4 mr-1"/> الحضور
              </button>
            </div>

            <div className="px-6 py-6">
              {activeTab === "details" && (
                <div className="space-y-6">
                  {!isGradMode ? (
                    <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                      <FormInput name="full_name" label="الاسم" defaultValue={trainee.full_name} register={register} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput name="email" label="الإيميل" defaultValue={trainee.email} register={register} />
                        <FormInput name="phone" label="الهاتف" defaultValue={trainee.phone} register={register} />
                      </div>
                      <FormInput name="position" label="القسم" defaultValue={trainee.position} register={register} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput name="start_date" type="date" label="البداية" defaultValue={trainee.start_date} register={register} />
                        <FormInput name="end_date" type="date" label="النهاية" defaultValue={trainee.end_date} register={register} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput name="duration_weeks" type="number" label="الأسابيع" defaultValue={trainee.duration_weeks} register={register} />
                        <FormInput name="monthly_stipend" type="number" label="المكافأة" defaultValue={trainee.monthly_stipend} register={register} />
                      </div>
                      <Button type="submit" disabled={isUpdating} className="w-full bg-[#4E9DA8]">حفظ التعديلات</Button>

                      {trainee.status !== "converted_to_employee" && (
                        <Button type="button" onClick={() => setIsGradMode(true)} className="w-full bg-emerald-600 gap-2 mt-4">
                          <GraduationCap className="h-4 w-4" /> ترقية وتعيين كموظف
                        </Button>
                      )}
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit(handleGraduate)} className="space-y-4 p-4 border border-emerald-200 bg-emerald-50 rounded-xl">
                      <h3 className="font-semibold text-emerald-800 flex items-center gap-2"><GraduationCap className="h-4 w-4"/> تعيين كموظف</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormInput name="salary" type="number" label="الراتب" register={register} rules={{ required: "مطلوب" }} />
                        <FormInput name="employment_type" type="select" label="نوع التوظيف" register={register} options={[{value:"full_time", label:"دوام كامل"}, {value:"part_time", label:"دوام جزئي"}]} />
                      </div>
                      <FormInput name="department" label="القسم" register={register} rules={{ required: "مطلوب" }} />
                      <FormInput name="branch" label="الفرع" register={register} rules={{ required: "مطلوب" }} />
                      <FormInput name="hire_date" type="date" label="تاريخ التعيين" register={register} rules={{ required: "مطلوب" }} />
                      <FormInput name="address" label="العنوان" register={register} />
                      <FormInput name="national_id" label="الرقم القومي" register={register} />
                      <FormInput name="birth_date" type="date" label="تاريخ الميلاد" register={register} />
                      
                      <div className="flex gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsGradMode(false)} className="flex-1 bg-white">إلغاء</Button>
                        <Button type="submit" disabled={isGraduating} className="flex-1 bg-emerald-600">تعيين</Button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {activeTab === "attendance" && <AttendanceTab traineeId={trainee.id} />}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}