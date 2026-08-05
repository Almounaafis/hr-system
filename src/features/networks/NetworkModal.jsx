import { useEffect } from "react";
import { useForm as useHookForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NetworkModal({ isOpen, onClose, onSave, editingNetwork, branches, isSaving }) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useHookForm({
    defaultValues: {
      ssid: "",
      mac_address: "",
      branch: "",
      description: "",
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (editingNetwork) {
        reset({
          ssid: editingNetwork.ssid || "",
          mac_address: editingNetwork.mac_address || "",
          branch: typeof editingNetwork.branch === 'object' ? editingNetwork.branch?.id || editingNetwork.branch?.name : editingNetwork.branch || "",
          description: editingNetwork.description || "",
        });
      } else {
        reset({
          ssid: "",
          mac_address: "",
          branch: "",
          description: "",
        });
      }
    }
  }, [isOpen, editingNetwork, reset]);

  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>{editingNetwork ? "تعديل الشبكة" : "إضافة شبكة جديدة"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="ssid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">اسم الشبكة (SSID)</label>
            <Input
              id="ssid"
              placeholder="مثال: Basmah-jeddah"
              {...register("ssid", { required: "اسم الشبكة مطلوب" })}
            />
            {errors.ssid && <p className="text-xs text-destructive">{errors.ssid.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="mac_address" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">عنوان الشبكة (MAC Address)</label>
            <Input
              id="mac_address"
              placeholder="مثال: 00:1A:2B:3C:4D:5E"
              dir="ltr"
              className="text-left"
              {...register("mac_address", { required: "عنوان الـ MAC مطلوب" })}
            />
            {errors.mac_address && <p className="text-xs text-destructive">{errors.mac_address.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="branch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">الفرع</label>
            <Controller
              name="branch"
              control={control}
              rules={{ required: "الفرع مطلوب" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger id="branch" className={!field.value ? "text-muted-foreground" : ""}>
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => {
                       const value = typeof b === 'object' ? b.name : b;
                       const label = typeof b === 'object' ? b.name : b;
                       return (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                       );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.branch && <p className="text-xs text-destructive">{errors.branch.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">وصف الشبكة (اختياري)</label>
            <Textarea
              id="description"
              placeholder="مثال: شبكة قسم المبيعات"
              className="resize-none"
              {...register("description")}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              إلغاء
            </Button>
            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? "جاري الحفظ..." : editingNetwork ? "حفظ التعديلات" : "اضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
