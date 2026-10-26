// @/features/custodies/CustodyDetailSheet.jsx
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { X, FileText, ArrowRightLeft, RotateCcw, UserPlus, History } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCustody } from "./hooks/useCustodies";
import { CustodyActionModal, CustodyReturnModal } from "./CustodyModals";
import { useAssignCustody, useReturnCustody, useTransferCustody } from "./hooks/useCustodies";

export default function CustodyDetailSheet({ custodyId, onClose }) {
  const { custody, isLoading, refetch } = useCustody(custodyId);
  const { assignCustody, isAssigning } = useAssignCustody();
  const { returnCustody, isReturning } = useReturnCustody();
  const { transferCustody, isTransferring } = useTransferCustody();

  const [modalType, setModalType] = useState(null); // 'assign' | 'transfer' | 'return'

  if (!custodyId) return null;

  const handleActionSubmit = async (data) => {
    if (modalType === "return") {
      await returnCustody({ id: custodyId, data });
    } else {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === "document" && data[key]?.[0]) {
          formData.append("document_url", data[key][0]);
        } else if (data[key] !== undefined && data[key] !== "") {
          formData.append(key, data[key]);
        }
      });
      
      if (modalType === "assign") await assignCustody({ id: custodyId, formData });
      if (modalType === "transfer") {
        if (data.new_assigned_to_type) {
          formData.set("new_assigned_to_type", data.new_assigned_to_type);
        }
        if (data.new_user_id || data.user_id) {
          const val = data.new_user_id || data.user_id;
          formData.set("new_user_id", val);
          formData.set("user_id", val);
        }
        if (data.new_trainee_id || data.trainee_id) {
          const val = data.new_trainee_id || data.trainee_id;
          formData.set("new_trainee_id", val);
          formData.set("trainee_id", val);
        }
        await transferCustody({ id: custodyId, formData });
      }
    }
    setModalType(null);
    refetch();
  };

  return (
    <>
      <Sheet 
        open={!!custodyId} 
        onOpenChange={(open) => {
          if (!open && !modalType) {
            onClose?.();
          }
        }} 
        side="left"
      >
        <SheetContent 
          className="!max-w-full sm:!max-w-[600px] w-full overflow-y-auto p-0"
          onPointerDownOutside={(e) => {
            if (modalType) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (modalType) e.preventDefault();
          }}
        >
          <SheetTitle className="sr-only">تفاصيل العهدة</SheetTitle>
          {isLoading ? <div className="p-6 text-center">جاري التحميل...</div> : !custody ? null : (
            <div className="pb-10 space-y-6">
              <div className="bg-gradient-to-r from-[#E8F5F3] to-[#F0F9FF] px-6 py-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold">{custody.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{custody.brand} {custody.model}</p>
                  </div>
                  <button onClick={onClose} className="p-2 bg-white rounded-full shadow-sm"><X className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="px-6 space-y-6">
                {/* Actions Bar */}
                <div className="flex gap-2 flex-wrap">
                  {custody.status === "available" && (
                    <Button onClick={() => setModalType("assign")} className="gap-2 bg-[#4E9DA8]"><UserPlus className="h-4 w-4"/> تعيين</Button>
                  )}
                  {custody.status === "assigned" && (
                    <>
                      <Button onClick={() => setModalType("return")} variant="outline" className="gap-2 border-red-200 text-red-600"><RotateCcw className="h-4 w-4"/> إرجاع</Button>
                      <Button onClick={() => setModalType("transfer")} className="gap-2 bg-amber-500 hover:bg-amber-600"><ArrowRightLeft className="h-4 w-4"/> نقل</Button>
                    </>
                  )}
                </div>

                {/* Current Assignment */}
                {custody.current_assignment && (
                  <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl space-y-2">
                    <h4 className="text-sm font-semibold text-blue-800">مُعينة حالياً إلى:</h4>
                    <p className="text-sm">{custody.current_assignment.employee_name || custody.current_assignment.trainee_name}</p>
                    <p className="text-xs text-muted-foreground">تاريخ التعيين: {custody.current_assignment.assigned_date}</p>
                    {custody.current_assignment.document_url && (
                      <a href={custody.current_assignment.document_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline flex items-center gap-1 mt-2">
                        <FileText className="h-3.5 w-3.5"/> عرض المستند
                      </a>
                    )}
                  </div>
                )}

                {/* History */}
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><History className="h-4 w-4"/> سجل الحركات</h3>
                  <div className="space-y-3">
                    {custody.history?.map((h) => (
                      <div key={h.id} className="p-3 border rounded-lg text-sm bg-muted/20">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-semibold">{h.status === "active" ? "تعيين" : h.status === "transferred" ? "نقل" : "إرجاع"}</span>
                          <span className="text-xs text-muted-foreground">{format(parseISO(h.assigned_date), "d MMM yyyy", { locale: arSA })}</span>
                        </div>
                        <p className="text-xs">المستلم: {h.employee_name || h.trainee_name}</p>
                        {h.received_back_by_name && <p className="text-xs text-muted-foreground mt-1">تم الاستلام بواسطة: {h.received_back_by_name}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Modals moved OUTSIDE the Sheet component, but inside the Fragment */}
      <CustodyActionModal 
        open={modalType === "assign" || modalType === "transfer"} 
        onClose={() => setModalType(null)} 
        onSubmit={handleActionSubmit}
        type={modalType}
        custodyId={custodyId}
        submitting={isAssigning || isTransferring}
      />

      <CustodyReturnModal 
        open={modalType === "return"} 
        onClose={() => setModalType(null)} 
        onSubmit={handleActionSubmit}
        submitting={isReturning}
      />
    </>
  );
}