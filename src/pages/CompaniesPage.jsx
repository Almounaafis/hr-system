// @/features/companies/CompaniesPage.jsx
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import logger from "@/lib/logger";
import CompaniesTable from "@/features/companies/CompaniesTable";
import CompanyModal from "@/features/companies/CompanyModal";
import { useCompanies } from "@/features/companies/hooks/useCompanies";
import { useInviteHr } from "@/features/invetations/useInviteHr";
import InviteHrDialog from "@/features/companies/InviteHrDialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function CompaniesPage() {
  const {
    companies,
    isLoading,
    isError,
    refetch,
    createCompany,
    updateCompany,
    deleteCompany,
    creating,
    updating,
    deleting,
  } = useCompanies();

  const { inviteHr, isInviting } = useInviteHr();

  // Company create/edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // Invite HR dialog
  const [inviteCompany, setInviteCompany] = useState(null);

  // Delete confirmation dialog
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleAddClick = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  // 1. Open the confirmation modal
  const handleDeleteClick = (company) => {
    setDeleteTarget(company);
  };

  // 2. Perform deletion when confirmed
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCompany(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      logger.error("Error deleting company:", error);
    }
  };

  const handleInviteHrClick = (company) => {
    setInviteCompany(company);
  };

  const handleInviteHrSubmit = async (email) => {
    if (!inviteCompany?.id) return;
    try {
      await inviteHr({ companyId: inviteCompany.id, email });
      setInviteCompany(null);
    } catch (error) {
      logger.error("Error inviting HR:", error);
    }
  };

  const handleSave = async (values) => {
    try {
      if (editingCompany) {
        await updateCompany(editingCompany.id, values);
      } else {
        await createCompany(values);
      }
      setIsModalOpen(false);
      setEditingCompany(null);
    } catch (error) {
      logger.error("Error saving company:", error);
    }
  };

  return (
    <div dir="rtl" className="space-y-6 p-2 sm:p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            الشركات
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            أضف وأدر الشركات المسجلة في النظام مع فروعها وأقسامها.
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> إضافة شركة
        </Button>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold">الشركات المسجلة</h2>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            {isLoading || isError ? "—" : companies.length}
          </span>
        </div>

        <CompaniesTable
          companies={companies}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onInviteHr={handleInviteHrClick}
          onRetry={refetch}
          skeletonRows={5}
        />
      </div>

      {/* Create / Edit modal */}
      <CompanyModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCompany(null);
        }}
        onSubmit={handleSave}
        editingCompany={editingCompany}
        submitting={creating || updating || deleting}
      />

      {/* Invite HR dialog */}
      <InviteHrDialog
        open={!!inviteCompany}
        onClose={() => setInviteCompany(null)}
        company={inviteCompany}
        onSubmit={handleInviteHrSubmit}
        submitting={isInviting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="حذف الشركة"
        description={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع البيانات المرتبطة بها.`}
        confirmText="حذف الشركة"
        isLoading={deleting}
      />
    </div>
  );
}