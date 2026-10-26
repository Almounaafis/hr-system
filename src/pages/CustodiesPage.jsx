 // @/features/custodies/CustodiesPage.jsx
import { useState } from "react";
import { Plus, Search, Laptop, Smartphone, Package, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormControl } from "@/components/ui/form-field";
import { FilterDropdown } from "@/features/requests/FilterDropdown";
import Pagination from "@/components/shared/Pagination";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useCustodies, useCustodyStats, useCreateCustody, useUpdateCustody, useDeleteCustody } from "@/features/custodies/hooks/useCustodies";
import CustodyTable from "@/features/custodies/CustodyTable";
import CustodyDetailSheet from "@/features/custodies/CustodyDetailSheet";
import { CustodyFormModal } from "@/features/custodies/CustodyModals";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function CustodiesPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const [debounce] = useDebouncedCallback((val) => {
    setDebouncedSearch(val);
    setPage(1);
  }, 500);

  // Data
  const { custodies, total, isLoading, isError, refetch } = useCustodies({
    page,
    status: status !== "all" ? status : undefined,
    category: category !== "all" ? category : undefined,
    search: debouncedSearch || undefined,
  });
  
  const { stats } = useCustodyStats();

  // Mutations
  const { createCustody, isCreating } = useCreateCustody();
  const { updateCustody, isUpdating } = useUpdateCustody();
  const { deleteCustody, isDeleting } = useDeleteCustody();

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustody, setEditingCustody] = useState(null);
  const [selectedCustodyId, setSelectedCustodyId] = useState(null);
  const [deletingCustody, setDeletingCustody] = useState(null);

  const handleFormSubmit = async (data) => {
    try {
      if (editingCustody) {
        await updateCustody({ id: editingCustody.id, data });
      } else {
        await createCustody(data);
      }
      setIsFormOpen(false);
      setEditingCustody(null);
    } catch {
      // Modal stays open so the user can review and fix errors
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCustody) return;
    try {
      await deleteCustody(deletingCustody.id);
      setDeletingCustody(null);
    } catch {
      // Handled by onError in useDeleteCustody
    }
  };

  return (
    <div dir="rtl" className="space-y-6 p-2 sm:p-1">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">العهد والأصول</h1>
          <p className="text-sm text-muted-foreground mt-1">إدارة الأجهزة، الأصول، وعمليات التعيين والنقل.</p>
        </div>
        <Button onClick={() => { setEditingCustody(null); setIsFormOpen(true); }} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> إضافة عهدة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "الإجمالي", key: "total", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "متاح", key: "available", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "مُعين", key: "assigned", icon: Laptop, color: "text-primary", bg: "bg-primary/10" },
          { label: "صيانة", key: "maintenance", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "تالف", key: "damaged", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
        ].map((s) => (
          <div key={s.key} className={`p-4 rounded-xl border border-border flex items-center gap-3 ${s.bg}`}>
            <s.icon className={`h-5 w-5 ${s.color}`} />
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{stats?.[s.key] || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Area */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">قائمة العهد</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
              {isLoading || isError ? "—" : total}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FormField name="search" className="relative w-full sm:w-56">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <FormControl
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); debounce(e.target.value); }}
                placeholder="بحث بالاسم أو السيريال..."
                className="pr-10 rounded-lg bg-background"
              />
            </FormField>
            <FilterDropdown
              label="الفئة"
              value={category}
              onChange={(val) => { setCategory(val); setPage(1); }}
              options={[
                { value: "all", label: "كل الفئات" },
                { value: "laptop", label: "لابتوب" },
                { value: "phone", label: "هاتف" },
                { value: "accessory", label: "ملحقات" },
              ]}
            />
            <FilterDropdown
              label="الحالة"
              value={status}
              onChange={(val) => { setStatus(val); setPage(1); }}
              options={[
                { value: "all", label: "كل الحالات" },
                { value: "available", label: "متاح" },
                { value: "assigned", label: "مُعين" },
                { value: "maintenance", label: "صيانة" },
                { value: "damaged", label: "تالف" },
              ]}
            />
          </div>
        </div>

        <CustodyTable
          custodies={custodies}
          isLoading={isLoading}
          isError={isError}
          onView={setSelectedCustodyId}
          onEdit={(custody) => {
            setEditingCustody(custody);
            setIsFormOpen(true);
          }}
          onDelete={(custody) => setDeletingCustody(custody)}
          onRetry={refetch}
          skeletonRows={limit}
        />

        {total > limit && (
          <div className="mt-6 flex justify-center sm:justify-end">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / limit)}
              totalRecords={total}
              pageSize={limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <CustodyFormModal
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCustody(null);
        }}
        onSubmit={handleFormSubmit}
        editingCustody={editingCustody}
        submitting={isCreating || isUpdating}
      />

      <CustodyDetailSheet
        custodyId={selectedCustodyId}
        onClose={() => setSelectedCustodyId(null)}
      />

      <ConfirmDialog
        open={Boolean(deletingCustody)}
        onClose={() => !isDeleting && setDeletingCustody(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف العهدة"
        description={`هل أنت متأكد من حذف العهدة "${deletingCustody?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="تأكيد الحذف"
        cancelText="إلغاء"
        isLoading={isDeleting}
      />
    </div>
  );
}