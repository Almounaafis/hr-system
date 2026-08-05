import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WifiOff, Calendar, ArrowRight, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function RegistrationDetailsDialog({ isOpen, onClose, record }) {
  if (!record) return null;

  // Formatting date
  const dateObj = new Date(record.date);
  const formattedDate = isNaN(dateObj.getTime())
    ? record.date
    : dateObj.toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const event = record.registrationEvents?.[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden" dir="rtl">
        <DialogHeader className="p-5 pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-center text-gray-900">
            تفاصيل التسجيل
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-2 space-y-5">
          {/* Employee Info & Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden shrink-0",
                  record.avatarBg,
                  record.avatarColor
                )}
              >
                {record.photo ? (
                  <img src={record.photo} alt={record.name} className="w-full h-full object-cover" />
                ) : (
                  record.avatar
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-900 text-right">
                  {record.name}
                </span>
                <span className="text-sm text-gray-500 text-right">{record.jobTitle}</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#FFF7F0] text-[#C0741F] shrink-0">
              <span>خارج الشبكة</span>
              <WifiOff className="w-4 h-4" />
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-700 font-medium px-1">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span>{formattedDate}</span>
          </div>

          <hr className="border-gray-100" />

          {/* Time & Label */}
          <div className="flex flex-col items-start gap-1 px-1">
            <span className="text-sm text-gray-500">
              {event?.label || "تسجيل الحضور"}
            </span>
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span dir="rtl">{event?.time || record.checkIn}</span>
              <ArrowRight className="w-5 h-5 text-gray-400 rotate-180" />
            </div>
          </div>

          {/* Reason Alert */}
          <div className="bg-[#F8FBFC] border border-[#E1EFF4] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#2B7A94] font-bold">
              <HelpCircle className="w-5 h-5" />
              <span>سبب الحضور خارج الشبكة</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed text-right">
              {event?.note || "لم يتم تقديم سبب مخصص."}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 p-5 w-full">
          <Button
            variant="outline"
            className="flex-1 h-11 text-gray-700 border-gray-300 hover:bg-gray-50 rounded-xl"
            onClick={onClose}
          >
            إلغاء
          </Button>
          <Button
            className="flex-1 h-11 bg-[#479E9E] hover:bg-[#3D8585] text-white rounded-xl"
            onClick={onClose}
          >
            اعتماد
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
