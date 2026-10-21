// @/features/companies/CompanyHrsPage.jsx
import { useState, useMemo } from "react";
import { Plus, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/features/companies/hooks/useCompanies";
import CompanyHrsTable from "@/features/hrs/CompanyHrsTable";
import InviteHrDialog from "@/features/hrs/InviteHrDialog";
import { FilterDropdown } from "@/features/requests/FilterDropdown";
import { useAllCompaniesHrs, useInviteCompanyHr } from "@/features/hrs/hooks/useCompanyHrs";

export default function CompanyHrsPage() {
  // 1. Fetch all companies 
  const { companies, isLoading: isLoadingCompanies } = useCompanies();

  // 2. Fetch HRs for all companies in parallel
  const { allHrs, isLoading: isLoadingHrs, isError, refetchAll } = useAllCompaniesHrs(companies);

  // Global loading state (either companies are loading, or HRs are loading)
  const isLoading = isLoadingCompanies || isLoadingHrs;

  // 3. Invite state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");

  // (Optional) Filter by company
  const [filterCompanyId, setFilterCompanyId] = useState("all");

  const filteredHrs = useMemo(() => {
    if (filterCompanyId === "all") return allHrs;
    return allHrs.filter((hr) => hr.company?.id === filterCompanyId);
  }, [allHrs, filterCompanyId]);

  const { inviteHr, isInviting } = useInviteCompanyHr(selectedCompanyId || filterCompanyId);

  const handleInviteSubmit = async (email) => {
    if (!selectedCompanyId && filterCompanyId === "all") return;
    await inviteHr(email);
    setIsInviteModalOpen(false);
  };

  return (
    <div dir="rtl" className="space-y-6 p-2 sm:p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            جميع مسؤولي (HR)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            عرض وإدارة كافة مسؤولي ال (HR) المسجلين عبر جميع الشركات في النظام.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">قائمة مسؤولي ال HRs</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
              {isLoading || isError ? "—" : filteredHrs.length}
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
              <UserPlus className="h-4 w-4" /> إضافة HR
            </Button>
          </div>
        </div>

        {/* Table */}
        <CompanyHrsTable
          hrs={filteredHrs}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetchAll}
          skeletonRows={10}
        />
      </div>

      {/* Invite Modal */}
      <InviteHrDialog
        title={" إضافة HR جديد "}
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        company={companies.find(c => c.id === selectedCompanyId)}
        onSubmit={handleInviteSubmit}
        submitting={isInviting}
      />
    </div>
  );
}