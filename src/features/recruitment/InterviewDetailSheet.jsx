// @/features/recruitment/InterviewDetailSheet.jsx
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { X, Star, CheckCircle, UserPlus, GraduationCap } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/forms/FormInput";
import { useForm } from "react-hook-form";
import { useEvaluateInterview, useConvertToEmployee, useConvertToTrainee } from "./hooks/useInterviews";
import { Badge } from "@/components/ui/badge";

export default function InterviewDetailSheet({ interview, onClose }) {
  const { evaluateInterview, isEvaluating } = useEvaluateInterview();
  const { convertToEmployee, isConvertingEmployee } = useConvertToEmployee();
  const { convertToTrainee, isConvertingTrainee } = useConvertToTrainee();

  const [mode, setMode] = useState("view"); // 'view' | 'evaluate' | 'convert_employee' | 'convert_trainee'

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (interview) {
      setMode("view");
      reset({
        rating: interview.rating || "",
        notes: interview.notes || "",
        outcome: interview.outcome || "pending",
        status: interview.status || "scheduled",
      });
    }
  }, [interview, reset]);

  if (!interview) return null;

  const handleEvaluate = async (data) => {
    await evaluateInterview({
      id: interview.id,
      data: {
        rating: Number(data.rating),
        notes: data.notes,
        outcome: data.outcome,
        status: data.status,
      },
    });
    setMode("view");
  };

  const handleConvertEmployee = async (data) => {
    await convertToEmployee({
      applicationId: interview.application_id,
      data: {
        salary: Number(data.salary),
        department: data.department,
        branch: data.branch,
        employment_type: data.employment_type,
        hire_date: data.hire_date,
        address: data.address,
        national_id: data.national_id,
        birth_date: data.birth_date,
        direct_manager: data.direct_manager,
      },
    });
    onClose();
  };

  const handleConvertTrainee = async (data) => {
    await convertToTrainee({
      applicationId: interview.application_id,
      data: {
        start_date: data.start_date,
        end_date: data.end_date || undefined,
        duration_weeks: data.duration_weeks ? Number(data.duration_weeks) : undefined,
      },
    });
    onClose();
  };

  return (
    <Sheet open={!!interview} onOpenChange={onClose} side="left">
      <SheetContent className="!max-w-full sm:!max-w-[600px] w-full overflow-y-auto p-0">
        <SheetTitle className="sr-only">تفاصيل المقابلة</SheetTitle>
        
        <div className="space-y-6 pb-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#E8F5F3] to-[#F0F9FF] px-6 py-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">{interview.applicant_name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{interview.position_title}</p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary" className="rounded-full text-xs capitalize">{interview.stage_name}</Badge>
                  <Badge variant="outline" className="rounded-full text-xs capitalize bg-white">{interview.status}</Badge>
                </div>
              </div>
              {/* <button onClick={onClose} className="p-2 bg-white rounded-full text-muted-foreground hover:text-foreground shadow-sm">
                <X className="h-4 w-4" />
              </button> */}
            </div>
          </div>

          <div className="px-6 space-y-8">
            {/* View Mode */}
            {mode === "view" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block mb-1">التاريخ</span>
                    <span className="font-medium">{format(parseISO(interview.interview_date), "d MMM yyyy", { locale: arSA })}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">الوقت</span>
                    <span className="font-medium">{interview.start_time?.substring(0,5)} - {interview.end_time?.substring(0,5)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1">المقابل</span>
                    <span className="font-medium">{interview.interviewer_name || "غير محدد"}</span>
                  </div>
                </div>

                {interview.status === "completed" && (
                  <div className="p-4 bg-muted rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">التقييم</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="h-4 w-4 fill-current" /> {interview.rating || 0} / 10
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">الملاحظات</span>
                      <p className="text-sm">{interview.notes || "لا توجد ملاحظات"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">النتيجة</span>
                      <Badge variant={interview.outcome === 'passed' ? 'success' : interview.outcome === 'failed' ? 'destructive' : 'secondary'}>
                        {interview.outcome}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  {interview.status !== "completed" && (
                    <Button onClick={() => setMode("evaluate")} className="bg-[#4E9DA8] hover:bg-[#4E9DA8]/80">
                      تقييم المقابلة
                    </Button>
                  )}
                  {interview.status === "completed" && interview.outcome === "passed" && (
                    <>
                      <Button onClick={() => setMode("convert_employee")} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                        <UserPlus className="h-4 w-4" /> تعيين كموظف
                      </Button>
                      <Button onClick={() => setMode("convert_trainee")} variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 gap-2">
                        <GraduationCap className="h-4 w-4" /> تعيين كمتدرج
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Evaluate Mode */}
            {mode === "evaluate" && (
              <form onSubmit={handleSubmit(handleEvaluate)} className="space-y-4">
                <h3 className="font-semibold border-b pb-2">تقييم المقابلة</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput name="rating" type="number" step="0.1" label="التقييم (0-10)" register={register} rules={{ required: "مطلوب", min: 0, max: 10 }} error={errors.rating?.message} />
                  <FormInput name="outcome" type="select" label="النتيجة" register={register} options={[
                    { value: "pending", label: "قيد الانتظار" },
                    { value: "passed", label: "ناجح" },
                    { value: "failed", label: "راسب" }
                  ]} />
                </div>
                <FormInput name="status" type="select" label="حالة المقابلة" register={register} options={[
                  { value: "scheduled", label: "مجدولة" },
                  { value: "completed", label: "مكتملة" },
                  { value: "cancelled", label: "ملغاة" },
                  { value: "no_show", label: "لم يحضر" }
                ]} />
                <FormInput name="notes" type="textarea" label="ملاحظات" register={register} rows={3} />
                
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setMode("view")} className="flex-1">إلغاء</Button>
                  <Button type="submit" disabled={isEvaluating} className="flex-1 bg-[#4E9DA8]">حفظ التقييم</Button>
                </div>
              </form>
            )}

            {/* Convert to Employee Form */}
            {mode === "convert_employee" && (
              <form onSubmit={handleSubmit(handleConvertEmployee)} className="space-y-4">
                <h3 className="font-semibold border-b pb-2 flex items-center gap-2"><UserPlus className="h-4 w-4"/> تعيين كموظف</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput name="salary" type="number" label="الراتب" register={register} rules={{ required: "مطلوب" }} />
                  <FormInput name="employment_type" type="select" label="نوع التوظيف" register={register} options={[
                    { value: "full_time", label: "دوام كامل" },
                    { value: "part_time", label: "دوام جزئي" }
                  ]} />
                </div>
                <FormInput name="department" label="القسم" register={register} rules={{ required: "مطلوب" }} />
                <FormInput name="branch" label="الفرع" register={register} rules={{ required: "مطلوب" }} />
                <FormInput name="hire_date" type="date" label="تاريخ التعيين" register={register} rules={{ required: "مطلوب" }} />
                <FormInput name="address" label="العنوان" register={register} />
                <FormInput name="national_id" label="الرقم القومي" register={register} />
                <FormInput name="birth_date" type="date" label="تاريخ الميلاد" register={register} />
                <FormInput name="direct_manager" label="المدير المباشر" register={register} />

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setMode("view")} className="flex-1">إلغاء</Button>
                  <Button type="submit" disabled={isConvertingEmployee} className="flex-1 bg-emerald-600">تعيين</Button>
                </div>
              </form>
            )}

            {/* Convert to Trainee Form */}
            {mode === "convert_trainee" && (
              <form onSubmit={handleSubmit(handleConvertTrainee)} className="space-y-4">
                <h3 className="font-semibold border-b pb-2 flex items-center gap-2"><GraduationCap className="h-4 w-4"/> تعيين كمتدرج</h3>
                <FormInput name="start_date" type="date" label="تاريخ البداية" register={register} rules={{ required: "مطلوب" }} />
                <FormInput name="end_date" type="date" label="تاريخ النهاية (اختياري)" register={register} />
                <FormInput name="duration_weeks" type="number" label="المدة بالأسابيع (اختياري)" register={register} />

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setMode("view")} className="flex-1">إلغاء</Button>
                  <Button type="submit" disabled={isConvertingTrainee} className="flex-1 bg-emerald-600">تعيين</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}