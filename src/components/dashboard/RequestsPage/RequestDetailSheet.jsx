import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, FileText, Calendar, Paperclip, XCircle, Trash2, CalendarDays, CirclePoundSterling } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { COLUMN_CONFIG, STATUS_LABELS, STATUS_COLORS } from "./constants";
import { formatDate } from "./helpers";

export function RequestDetailSheet({ selectedRequest, selectedRequestKind, onClose, onApprove, onReject, onDelete, isDeleting }) {
  const employee = selectedRequest?.employee || {};

  return (
    <Sheet open={!!selectedRequest} onOpenChange={onClose} side="left">
      <SheetContent className="w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            {COLUMN_CONFIG[selectedRequestKind]?.detailTitle || "تفاصيل الطلب"}
          </SheetTitle>
        </SheetHeader>
        {selectedRequest && (
          <div className="space-y-6">
            {selectedRequestKind === "leave" && selectedRequest.aiRecommendation && (
              <div
                className={cn(
                  "p-4 rounded-lg border",
                  selectedRequest.aiRecommendation === "approve"
                    ? "bg-green-50 border-green-100"
                    : "bg-amber-50 border-amber-100"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {selectedRequest.aiRecommendation === "approve" ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                  <span className="text-sm font-semibold">توصية الذكاء الاصطناعي</span>
                </div>
                <p className="text-xs text-muted-foreground">{selectedRequest.aiReason}</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-teal-100 text-teal-700">
                {employee.name?.charAt(0) || "E"}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{employee.name || "—"}</h3>
                <p className="text-sm text-muted-foreground">{employee.department || "—"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedRequestKind === "reward" && (
                <>
                  <div className="p-3 bg-[#1010110F] border border-[#C0C1C3]  rounded-lg col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">من تاريخ</p>
                    <p className="font-semibold text-foreground flex items-center gap-1"><CalendarDays className="w-4 h-4" /> {formatDate(selectedRequest.start_date)}</p>
                  </div>
                  <div className="flex text-md justify-between items-center col-span-2">
                    <div className="flex items-center gap-2">
                      <CirclePoundSterling className="w-4 h-4 text-muted-foreground" />
                      <p className=" text-muted-foreground  ">قيمة المكافأة</p>
                    </div>
                    <p className="font-semibold text-foreground py-1.5 px-3 border border-[#C0C1C3] rounded-lg"> {selectedRequest.amount || 0}</p>
                  </div>
                </>
              )}
              {selectedRequestKind === "leave" && (
                <>
                  <div className="p-3 bg-[#1010110F] border border-[#C0C1C3]  rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">من</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold text-foreground">{formatDate(selectedRequest.start_date)}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-[#1010110F] border border-[#C0C1C3]  rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">الى</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold text-foreground">{formatDate(selectedRequest.end_date)}</p>
                    </div>
                  </div>
                </>
              )}
              {selectedRequestKind === "permission" && (
                <>
                  <div className="p-3 bg-[#1010110F] border border-[#C0C1C3]  rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">تاريخ</p>
                    <p className="font-semibold text-foreground">{formatDate(selectedRequest.start_date)}</p>
                  </div>
                  <div className="p-3 bg-[#1010110F] border border-[#C0C1C3]  rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">المدة</p>
                    <p className="font-semibold text-foreground">{selectedRequest.duration_hours || 0} ساعات</p>
                  </div>
                </>
              )}
              {selectedRequestKind === "salaryIncrease" && (
                <>
                  <div className="p-3 bg-[#1010110F] border border-[#C0C1C3]  rounded-lg col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">تاريخ اليوم</p>
                    <p className="font-semibold text-foreground">{formatDate(selectedRequest.start_date)}</p>
                  </div>
                  <div className="flex text-md justify-between items-center col-span-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground mb-1">المبلغ / الزيادة</p>
                    </div>
                    <p className="font-semibold text-foreground py-1.5 px-3 border border-[#C0C1C3] rounded-lg">
                      {selectedRequest.amount || 0}
                    </p>
                  </div>
                </>
              )}
              {selectedRequestKind === "remoteWork" && (
                <>
                  <div className="p-3 bg-[#1010110F] border border-[#C0C1C3]  rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">تاريخ البدء</p>
                    <p className="font-semibold text-foreground">{formatDate(selectedRequest.start_date)}</p>
                  </div>
                  <div className="p-3 bg-[#1010110F] border border-[#C0C1C3]  rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">تاريخ الانتهاء</p>
                    <p className="font-semibold text-foreground">{formatDate(selectedRequest.end_date)}</p>
                  </div>
                </>
              )}
              {selectedRequestKind === "advance" && (
                <>
                  <div className="p-3 bg-[#1010110F] border border-[#C0C1C3]  rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">تاريخ اليوم</p>
                    <p className="font-semibold text-foreground">{formatDate(selectedRequest.start_date)}</p>
                  </div>
                  <div className="flex text-md justify-between items-center col-span-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground mb-1">المبلغ المطلوب</p>
                    </div>
                    <p className="font-semibold text-foreground py-1.5 px-3 border border-[#C0C1C3] rounded-lg">
                      {selectedRequest.amount || 0}
                    </p>
                  </div>
                </>
              )}
              <div className="flex text-md justify-between items-center col-span-2">
                <p className="text-xs text-muted-foreground mb-1">الحالة</p>
                <span className={cn("font-semibold px-3 py-1.5 rounded-full", STATUS_COLORS[selectedRequest.status])}>{STATUS_LABELS[selectedRequest.status]}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs text-muted-foreground mb-1">سبب الطلب</h4>
              <p className="text-lg text-[#1E1F1F]">{selectedRequest.reason}</p>
            </div>

            {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">مرفقات</h4>
                {selectedRequest.attachments.map((attachment, index) => (
                  <div key={index} className="p-3 bg-[#EDF8FC] rounded-lg flex items-center gap-3 mb-2">
                    <Paperclip className="w-5 h-5 text-muted-foreground" />
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                      {attachment.filename}
                    </a>
                  </div>
                ))}
              </div>
            )}

            {selectedRequest.status === "pending" && (
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  className="flex-1 min-h-[2.7rem] flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white"
                  onClick={() => onApprove(selectedRequest)}
                >
                  <CheckCircle className="w-4 h-4" />
                  موافقة
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 min-h-[2.7rem] flex items-center justify-center gap-2"
                  onClick={() => onReject(selectedRequest)}
                >
                  <XCircle className="w-4 h-4" />
                  رفض
                </Button>
              </div>
            )}

            {selectedRequest.status !== "pending" && (
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                className="flex-1 min-h-[2.7rem] flex items-center justify-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => onDelete(selectedRequest)}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "جاري الحذف..." : "حذف الطلب"}
              </Button>
            </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
