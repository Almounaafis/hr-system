// @/features/companies/CompanyManagersPage.jsx
import { useState, useMemo } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/features/companies/hooks/useCompanies";
import { useAllCompaniesManagers, useInviteCompanyManager } from "../features/managers/hooks/useCompanyManagers";
import CompanyManagersTable from "../features/managers/CompanyManagersTable";
import { FilterDropdown } from "@/features/requests/FilterDropdown";
import InviteHrDialog from "@/features/hrs/InviteHrDialog";

export default function CompanyManagersPage() {
  // 1. Fetch all companies
  const { companies, isLoading: isLoadingCompanies } = useCompanies();

  // 2. Fetch Managers for all companies
  const { allManagers, isLoading: isLoadingManagers, isError, refetchAll } = useAllCompaniesManagers(companies);

  const isLoading = isLoadingCompanies || isLoadingManagers;

  // 3. Invite state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  // (Optional) Filter by company
  const [filterCompanyId, setFilterCompanyId] = useState("all");
  
  const filteredManagers = useMemo(() => {
    if (filterCompanyId === "all") return allManagers;
    return allManagers.filter((mgr) => mgr.company?.id === filterCompanyId);
  }, [allManagers, filterCompanyId]);

  const { inviteManager, isInviting } = useInviteCompanyManager(selectedCompanyId || filterCompanyId);

  const handleInviteSubmit = async (email) => {
    if (!selectedCompanyId && filterCompanyId === "all") return;
    await inviteManager(email);
    setIsInviteModalOpen(false);
  };

  return (
    <div dir="rtl" className="space-y-6 p-2 sm:p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            جميع المدراء (Managers)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            عرض وإدارة كافة المدراء المسجلين عبر جميع الشركات في النظام.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">قائمة المدراء</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
              {isLoading || isError ? "—" : filteredManagers.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="الشركة"
              value={filterCompanyId}
              onChange={setFilterCompanyId}
              options={[
                { value: "all", label: "كل الشركات" },
                ...companies.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            
            <Button 
              onClick={() => {
                setSelectedCompanyId(filterCompanyId !== "all" ? filterCompanyId : companies[0]?.id || "");
                setIsInviteModalOpen(true);
              }} 
              className="gap-2 shrink-0 bg-[#4E9DA8] hover:bg-[#4E9DA8]/90"
              disabled={companies.length === 0}
            >
              <UserPlus className="h-4 w-4" /> إضافة مدير
            </Button>
          </div>
        </div>

        {/* Table */}
        <CompanyManagersTable
          managers={filteredManagers}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetchAll}
          skeletonRows={10}
        />
      </div>

      {/* Invite Modal (reusing the design from InviteHrDialog) */}
      <InviteHrDialog
        title="إضافة مدير شركة"
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        company={companies.find(c => c.id === selectedCompanyId)}
        onSubmit={handleInviteSubmit}
        submitting={isInviting}
      />
    </div>
  );
}