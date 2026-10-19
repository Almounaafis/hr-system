// @/features/companies/CompaniesTable.jsx
import { Building2, Users, UserCog } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { getInitials, safeArray } from "./helpers";
import { CompanyRowSkeleton } from "./CompaniesSkeletons";
import RowActionsMenu from "./RowActionsMenu";

export default function CompaniesTable({
  companies = [],
  isLoading,
  isError,
  onEdit,
  onDelete,
  onInviteHr,
  onRetry,
  skeletonRows = 5,
}) {
  const columns = [
    /* ── Logo + name + type ── */
    {
      key: "name",
      header: "الشركة",
      render: (company) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement.classList.add(
                    "bg-primary/10",
                    "text-primary",
                    "font-semibold",
                    "text-sm"
                  );
                  e.currentTarget.parentElement.textContent = getInitials(
                    company.name
                  );
                }}
              />
            ) : (
              <span className="text-sm font-semibold text-primary">
                {getInitials(company.name)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-xs sm:text-sm truncate">
              {company.name || "—"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {company.type || "—"}
            </p>
          </div>
        </div>
      ),
    },

    /* ── Branches ── */
    {
      key: "branches",
      header: "الفروع",
      render: (company) => {
        const branches = safeArray(company.branches);
        if (branches.length === 0)
          return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {branches.slice(0, 3).map((b) => (
              <Badge
                key={b}
                variant="secondary"
                className="rounded-full text-[10px] bg-[#EAF4F5] text-[#3D7A83]"
              >
                {b}
              </Badge>
            ))}
            {branches.length > 3 && (
              <Badge variant="secondary" className="rounded-full text-[10px]">
                +{branches.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },

    /* ── Departments ── */
    {
      key: "departments",
      header: "الأقسام",
      render: (company) => {
        const departments = safeArray(company.departments);
        if (departments.length === 0)
          return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {departments.slice(0, 3).map((d) => (
              <Badge
                key={d}
                variant="secondary"
                className="rounded-full text-[10px] bg-[#F3EFFE] text-[#5B3FA6]"
              >
                {d}
              </Badge>
            ))}
            {departments.length > 3 && (
              <Badge variant="secondary" className="rounded-full text-[10px]">
                +{departments.length - 3}
              </Badge>
            )}
          </div>
        );
      },
    },

    /* ── HR ── */
    {
      key: "hr",
      header: "مسؤول الـ HR",
      render: (company) => {
        const hr = company.hr;
        if (!hr || !hr.id)
          return <span className="text-muted-foreground">—</span>;
        return (
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-full bg-muted overflow-hidden shrink-0 flex items-center justify-center">
              {hr.profile_image_url ? (
                <img
                  src={hr.profile_image_url}
                  alt={hr.name || "HR"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserCog className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm truncate text-foreground">
                {hr.name || "—"}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {hr.email || "—"}
              </p>
            </div>
          </div>
        );
      },
    },

    /* ── Employees count ── */
    {
      key: "employees_count",
      header: "الموظفين",
      cellClassName: "text-center",
      render: (company) => (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {company.employees_count ?? 0}
        </span>
      ),
    },

    /* ── Actions (kebab) ── */
    {
      key: "actions",
      header: "الإجراءات",
      cellClassName: "text-left",
      render: (company) => (
        <div className="flex justify-end">
          <RowActionsMenu
            company={company}
            onEdit={onEdit}
            onDelete={onDelete}
            onInviteHr={onInviteHr}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={companies}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyMessage="لا توجد شركات مضافة"
      skeletonRows={skeletonRows}
      renderSkeletonRow={() => <CompanyRowSkeleton />}
      getRowKey={(company) => company.id}
    />
  );
}