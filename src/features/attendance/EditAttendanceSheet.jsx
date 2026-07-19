import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { FormField, FormControl, FormLabel } from "@/components/ui/form-field";

export function EditAttendanceSheet({ open, onOpenChange, editingRecord, editForm, setEditForm, onSave, onCancel }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="left">
      <SheetContent className="!max-w-[500px] overflow-y-auto">
        <SheetTitle className="sr-only">تعديل تسجيل الحضور</SheetTitle>
        <h2 className="text-xl font-bold text-gray-900 mb-6">تعديل تسجيل الحضور</h2>
        {editingRecord && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">الموظف</p>
              <p className="text-lg font-semibold text-gray-900">{editingRecord.name}</p>
              <p className="text-sm text-gray-600">{editingRecord.department}</p>
            </div>

            <FormField name="checkIn">
              <FormLabel>وقت الحضور</FormLabel>
              <FormControl
                type="time"
                value={editForm.checkIn}
                onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
              />
            </FormField>

            <FormField name="checkOut">
              <FormLabel>وقت الانصراف</FormLabel>
              <FormControl
                type="time"
                value={editForm.checkOut}
                onChange={(e) => {
                  const newCheckOut = e.target.value;
                  if (editForm.checkIn && newCheckOut && newCheckOut < editForm.checkIn) {
                    return; // Prevent selecting check-out before check-in
                  }
                  setEditForm({ ...editForm, checkOut: newCheckOut });
                }}
              />
            </FormField>

            <FormField name="status">
              <FormLabel>الحالة</FormLabel>
              <FormControl
                type="select"
                value={editForm.status}
                onChange={(value) => setEditForm({ ...editForm, status: value })}
                options={[
                  { value: "حاضر", label: "حاضر" },
                  { value: "متأخر", label: "متأخر" },
                ]}
              />
            </FormField>

            <div className="flex gap-3 pt-4">
              <Button onClick={onSave} className="flex-1">
                حفظ التغييرات
              </Button>
              <Button variant="outline" onClick={onCancel} className="flex-1">
                إلغاء
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
