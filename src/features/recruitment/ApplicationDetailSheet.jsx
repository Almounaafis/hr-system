// @/features/recruitment/ApplicationDetailSheet.jsx
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { 
  X, Loader2, FileText, XCircle, 
  Download, Mail, Phone, Calendar, Target, Star
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/shared/forms/FormInput";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";
import { handleSuccess, handleError } from "@/lib/errorHandlers";

// Import your existing hooks for fetching the data
import { useApplication } from "./hooks/useApplications";
import { ApplicationDetailSkeleton } from "./ApplicationsSkeletons";

function formatDate(value) {
  if (!value) return "—";
  try {
    return format(parseISO(value), "d MMM yyyy, hh:mm a", { locale: arSA });
  } catch {
    return value;
  }
}

const STATUS_MAP = {
  applied: { label: "جديد", color: "bg-blue-50 text-blue-600" },
  accepted: { label: "مقبول", color: "bg-emerald-50 text-emerald-600" },
  rejected: { label: "مرفوض", color: "bg-red-50 text-red-600" },
};

export default function ApplicationDetailSheet({ applicationId, onClose }) {
  const queryClient = useQueryClient();
  const { application, isLoading, refetch } = useApplication(applicationId);
  
  const [isRejectingMode, setIsRejectingMode] = useState(false);
  const [scoreValue, setScoreValue] = useState(0);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Reset local state when application loads or changes
  useEffect(() => {
    if (application) {
      setScoreValue(application.qualification_score || 0);
    }
    setIsRejectingMode(false);
    reset({ rejection_reason: "" });
  }, [application, reset]);

  // ─── Mutation: Update Qualification (PATCH) ──────────────────────────────────
  const { mutateAsync: updateScore, isPending: isUpdatingScore } = useMutation({
    mutationFn: async ({ id, score }) => {
      const res = await api.patch(`/recruitment/applications/${id}/qualification`, { score }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    },
    onSuccess: (res) => {
      handleSuccess(res, "تم تحديث التقييم بنجاح");
      refetch(); // Refresh the sheet
      queryClient.invalidateQueries({ queryKey: ["recruitment-applications"] }); // Refresh the table
    },
    onError: handleError,
  });

  // ─── Mutation: Reject Application (POST) ─────────────────────────────────────
  const { mutateAsync: rejectApplication, isPending: isRejecting } = useMutation({
    mutationFn: async ({ id, rejection_reason }) => {
      const res = await api.post(`/recruitment/applications/${id}/reject`, { rejection_reason }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    },
    onSuccess: (res) => {
      handleSuccess(res, "تم رفض الطلب بنجاح");
      setIsRejectingMode(false);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["recruitment-applications"] });
    },
    onError: handleError,
  });

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleQualify = async () => {
    if (!applicationId) return;
    await updateScore({ id: applicationId, score: Number(scoreValue) });
  };

  const handleReject = async (data) => {
    if (!applicationId) return;
    await rejectApplication({ id: applicationId, rejection_reason: data.rejection_reason });
  };

  return (
    <Sheet open={!!applicationId} onOpenChange={onClose} side="left">
      <SheetContent className="!max-w-full sm:!max-w-[600px] w-full overflow-y-auto p-0">
        <SheetTitle className="sr-only">تفاصيل المتقدم</SheetTitle>

        {isLoading ? (
          <div className="p-6 space-y-6">
            <ApplicationDetailSkeleton />
          </div>
        ) : !application ? null : (
          <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#E8F5F3] to-[#F0F9FF] px-6 py-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{application.full_name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{application.position_title}</p>
                  <Badge variant="secondary" className={`mt-3 rounded-full text-xs ${STATUS_MAP[application.status]?.color || "bg-muted"}`}>
                    {STATUS_MAP[application.status]?.label || application.status}
                  </Badge>
                </div>
                {/* <button onClick={onClose} className="p-2 bg-white rounded-full text-muted-foreground hover:text-foreground shadow-sm">
                  <X className="h-4 w-4" />
                </button> */}
              </div>
            </div>

            <div className="px-6 space-y-8">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" /> {application.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground" dir="ltr">
                  <Phone className="h-4 w-4 text-muted-foreground" /> {application.phone || "—"}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground" /> {formatDate(application.created_at)}
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Target className="h-4 w-4 text-muted-foreground" /> الدرجة الحالية: <span className="font-bold">{application.qualification_score}</span>
                </div>
              </div>

              {/* CV Download & Reject CV Action */}
              <div>
                <h3 className="text-sm font-semibold mb-2">السيرة الذاتية</h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {application.cv_url ? (
                    <a 
                      href={application.cv_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 inline-flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors text-sm font-medium"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      عرض / تحميل السيرة الذاتية (CV)
                      <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                    </a>
                  ) : (
                    <div className="flex-1 p-3 rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground italic">
                      لا توجد سيرة ذاتية مرفقة.
                    </div>
                  )}

                  {/* Reject CV Button (Only if not already rejected/accepted) */}
                  {application.status !== "rejected" && application.status !== "accepted" && (
                    <Button 
                      variant="outline" 
                      className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 h-11"
                      onClick={() => setIsRejectingMode(true)}
                    >
                      <XCircle className="h-4 w-4 mr-2" /> رفض
                    </Button>
                  )}
                </div>
              </div>

              {/* Extra Data (Custom Fields) */}
              {application.extra_data && Object.keys(application.extra_data).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">بيانات إضافية</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(application.extra_data).map(([key, val]) => (
                      <div key={key} className="p-3 bg-muted rounded-lg text-sm flex justify-between">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium text-foreground">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reason (If rejected) */}
              {application.status === "rejected" && application.rejection_reason && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <h4 className="text-sm font-semibold text-red-800 mb-1">سبب الرفض</h4>
                  <p className="text-sm text-red-600">{application.rejection_reason}</p>
                </div>
              )}

              {/* Action Area: Qualify / Reject */}
              {application.status !== "rejected" && application.status !== "accepted" && (
                <div className="border-t border-border pt-6">
                  {!isRejectingMode ? (
                    <div className="p-4 border border-border rounded-xl bg-muted/10 space-y-4">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" /> تقييم المتقدم
                      </h4>
                      <div className="flex items-end gap-3">
                        <div className="flex-1 space-y-1.5">
                          <label className="text-xs text-muted-foreground">الدرجة (0-100)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={scoreValue}
                            onChange={(e) => setScoreValue(e.target.value)}
                            className="w-full h-10 rounded-lg border border-border px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                        <Button 
                          onClick={handleQualify} 
                          disabled={isUpdatingScore} 
                          className="h-10 bg-[#4E9DA8] hover:bg-[#4E9DA8]/80"
                        >
                          {isUpdatingScore ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ الدرجة"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(handleReject)} className="space-y-4 p-4 border border-red-200 bg-red-50/50 rounded-xl">
                      <h4 className="text-sm font-semibold text-red-800">سبب الرفض</h4>
                      <FormInput 
                        name="rejection_reason" 
                        type="textarea" 
                        placeholder="اكتب سبب الرفض هنا..." 
                        register={register} 
                        rules={{ required: "مطلوب" }}
                        error={errors.rejection_reason?.message}
                      />
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsRejectingMode(false)} className="flex-1 bg-white">إلغاء</Button>
                        <Button type="submit" variant="destructive" disabled={isRejecting} className="flex-1">
                          {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "تأكيد الرفض"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}