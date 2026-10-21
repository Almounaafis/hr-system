// @/features/companies/CompanyManagementPage.jsx
import { useState, useMemo } from "react";
import { Plus, UserPlus, Search, Building2, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, FormControl } from "@/components/ui/form-field";
import logger from "@/lib/logger";

// Components
import CompaniesTable from "@/features/companies/CompaniesTable";
import CompanyModal from "@/features/companies/CompanyModal";
import InviteHrDialog from "@/features/hrs/InviteHrDialog"; // Assuming it's here based on your imports
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { FilterDropdown } from "@/features/requests/FilterDropdown";

// Hooks
import { useCompanies } from "@/features/companies/hooks/useCompanies";
import { useAllCompaniesManagers, useInviteCompanyManager } from "@/features/managers/hooks/useCompanyManagers";
import CompanyHrsTable from "@/features/hrs/CompanyHrsTable";
import CompanyManagersTable from "@/features/managers/CompanyManagersTable";
import { useAllCompaniesHrs, useInviteCompanyHr } from "@/features/hrs/hooks/useCompanyHrs";

export default function CompanyManagementPage() {
  // ─── Active Tab State ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("companies"); // 'companies' | 'hrs' | 'managers'

  // ─── Data Fetching ───────────────────────────────────────────────────────────
  // 1. Companies (always needed for all tabs to map IDs/names)
  const {
    companies,
    isLoading: isLoadingCompanies,
    isError: isErrorCompanies,
    refetch: refetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    creating,
    updating,
    deleting,
  } = useCompanies();

  // 2. HRs (only fetch if on the HR tab to save network requests)
  const {
    allHrs,
    isLoading: isLoadingHrs,
    isError: isErrorHrs,
    refetchAll: refetchHrs,
  } = useAllCompaniesHrs(activeTab === "hrs" ? companies : []);

  // 3. Managers (only fetch if on the Managers tab)
  const {
    allManagers,
    isLoading: isLoadingManagers,
    isError: isErrorManagers,
    refetchAll: refetchManagers,
  } = useAllCompaniesManagers(activeTab === "managers" ? companies : []);

  // ─── Filters & Search ───────────────────────────────────────────────────────
  const [filterCompanyId, setFilterCompanyId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Apply Company Filter
  const filteredHrs = useMemo(() => {
    let result = allHrs;
    if (filterCompanyId !== "all") result = result.filter((hr) => hr.company?.id === filterCompanyId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((hr) => hr.name?.toLowerCase().includes(q) || hr.email?.toLowerCase().includes(q));
    }
    return result;
  }, [allHrs, filterCompanyId, searchQuery]);

  const filteredManagers = useMemo(() => {
    let result = allManagers;
    if (filterCompanyId !== "all") result = result.filter((mgr) => mgr.company?.id === filterCompanyId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((mgr) => mgr.name?.toLowerCase().includes(q) || mgr.email?.toLowerCase().includes(q));
    }
    return result;
  }, [allManagers, filterCompanyId, searchQuery]);

  // ─── Modals State ───────────────────────────────────────────────────────────
  // Company Modal
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  
  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Invite Modal (Shared for HR & Manager)
  const [inviteContext, setInviteContext] = useState(null); // { type: 'hr' | 'manager', companyId: string }
  const [selectedCompanyIdForInvite, setSelectedCompanyIdForInvite] = useState("");

  // Invite Mutations
  const { inviteHr, isInviting: isInvitingHr } = useInviteCompanyHr(inviteContext?.type === "hr" ? selectedCompanyIdForInvite : null);
  const { inviteManager, isInviting: isInvitingManager } = useInviteCompanyManager(inviteContext?.type === "manager" ? selectedCompanyIdForInvite : null);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  // Tab switch resets filters
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setFilterCompanyId("all");
  };

  // Company CRUD
  const handleAddCompanyClick = () => {
    setEditingCompany(null);
    setIsCompanyModalOpen(true);
  };

  const handleEditCompanyClick = (company) => {
    setEditingCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleSaveCompany = async (values) => {
    try {
      if (editingCompany) {
        await updateCompany(editingCompany.id, values);
      } else {
        await createCompany(values);
      }
      setIsCompanyModalOpen(false);
      setEditingCompany(null);
    } catch (error) {
      logger.error("Error saving company:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCompany(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      logger.error("Error deleting company:", error);
    }
  };

  // Invite Handlers
  const handleOpenInvite = (type, companyId = null) => {
    setInviteContext({ type });
    // Pre-select company if filtered, otherwise default to first company
    setSelectedCompanyIdForInvite(companyId || (filterCompanyId !== "all" ? filterCompanyId : companies[0]?.id || ""));
  };

  const handleInviteSubmit = async (email) => {
    if (!selectedCompanyIdForInvite) return;
    if (inviteContext.type === "hr") {
      await inviteHr(email);
    } else {
      await inviteManager(email);
    }
    setInviteContext(null);
  };

  // ─── Render Helpers ─────────────────────────────────────────────────────────
  const currentCompanyForInvite = companies.find((c) => c.id === selectedCompanyIdForInvite);

  return (
    <div dir="rtl" className="space-y-6 p-2 sm:p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">إدارة الشركات والصلاحيات</h1>
          <p className="text-sm text-muted-foreground mt-1">
            أضف الشركات وأدر المحاسبين والمدراء المسجلين في النظام.
          </p>
        </div>
        
        {/* Main Action Button (Dynamic based on Tab) */}
        {activeTab === "companies" && (
          <Button onClick={handleAddCompanyClick} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" /> إضافة شركة
          </Button>
        )}
        {activeTab === "hrs" && (
          <Button 
            onClick={() => handleOpenInvite("hr")} 
            className="gap-2 shrink-0 bg-[#4E9DA8] hover:bg-[#4E9DA8]/90"
            disabled={companies.length === 0}
          >
            <UserPlus className="h-4 w-4" /> إضافة محاسب
          </Button>
        )}
        {activeTab === "managers" && (
          <Button 
            onClick={() => handleOpenInvite("manager")} 
            className="gap-2 shrink-0 bg-[#4E9DA8] hover:bg-[#4E9DA8]/90"
            disabled={companies.length === 0}
          >
            <UserPlus className="h-4 w-4" /> إضافة مدير
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => handleTabChange("companies")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "companies" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Building2 className="h-4 w-4" /> الشركات
        </button>
        <button
          onClick={() => handleTabChange("hrs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "hrs" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Users className="h-4 w-4" /> مسؤولي ال HR
        </button>
        <button
          onClick={() => handleTabChange("managers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "managers" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> المدراء
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">
        
        {/* Toolbar (only for HR and Manager tabs) */}
        {activeTab !== "companies" && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">
                {activeTab === "hrs" ? "قائمة مسؤولي ال HRs" : "قائمة المدراء"}
              </h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                {activeTab === "hrs" 
                  ? (isLoadingHrs || isErrorHrs ? "—" : filteredHrs.length)
                  : (isLoadingManagers || isErrorManagers ? "—" : filteredManagers.length)
                }
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FormField name="search" className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <FormControl
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث بالاسم أو الإيميل..."
                  className="pr-10 rounded-lg bg-background"
                />
              </FormField>
              
              <FilterDropdown
                label="الشركة"
                value={filterCompanyId}
                onChange={setFilterCompanyId}
                options={[
                  { value: "all", label: "كل الشركات" },
                  ...companies.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </div>
          </div>
        )}

        {/* Tables Area */}
        {activeTab === "companies" && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold">الشركات المسجلة</h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                {isLoadingCompanies || isErrorCompanies ? "—" : companies.length}
              </span>
            </div>
            <CompaniesTable
              companies={companies}
              isLoading={isLoadingCompanies}
              isError={isErrorCompanies}
              onEdit={handleEditCompanyClick}
              onDelete={(c) => setDeleteTarget(c)}
              onInviteHr={(c) => handleOpenInvite("hr", c.id)}
              onRetry={refetchCompanies}
            />
          </>
        )}

        {activeTab === "hrs" && (
          <CompanyHrsTable
            hrs={filteredHrs}
            isLoading={isLoadingHrs || isLoadingCompanies}
            isError={isErrorHrs}
            onRetry={refetchHrs}
            skeletonRows={5}
          />
        )}

        {activeTab === "managers" && (
          <CompanyManagersTable
            managers={filteredManagers}
            isLoading={isLoadingManagers || isLoadingCompanies}
            isError={isErrorManagers}
            onRetry={refetchManagers}
            skeletonRows={5}
          />
        )}
      </div>

      {/* ─── Modals ─────────────────────────────────────────────────────────── */}

      {/* Create / Edit Company */}
      <CompanyModal
        open={isCompanyModalOpen}
        onClose={() => {
          setIsCompanyModalOpen(false);
          setEditingCompany(null);
        }}
        onSubmit={handleSaveCompany}
        editingCompany={editingCompany}
        submitting={creating || updating || deleting}
      />

      {/* Invite Modal (Shared for HR / Manager) */}
      <InviteHrDialog
        title={inviteContext?.type === "manager" ? "إضافة مدير شركة" : "إضافة HR جديد"}
        open={!!inviteContext}
        onClose={() => setInviteContext(null)}
        company={currentCompanyForInvite}
        onSubmit={handleInviteSubmit}
        submitting={inviteContext?.type === "manager" ? isInvitingManager : isInvitingHr}
      />

      {/* Delete Confirmation */}
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