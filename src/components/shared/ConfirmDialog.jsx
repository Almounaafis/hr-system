import { X, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "تأكيد الحذف",
  description = "هل أنت متأكد من هذا الإجراء؟ لا يمكن التراجع عنه.",
  confirmText = "حذف",
  cancelText = "إلغاء",
  isDestructive = true,
  isLoading = false,
}) {
  if (!open) return null;

  const handleClose = () => {
    if (isLoading) return;
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleClose}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-card shadow-xl rounded-3xl p-5 sm:p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${isDestructive ? "bg-red-50 text-red-600" : "bg-primary/10 text-primary"}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground mb-1">{title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:flex-1 h-10"
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? "destructive" : "default"}
            className="w-full sm:flex-1 h-10 bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}