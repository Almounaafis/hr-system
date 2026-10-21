// @/features/companies/CompanyManagersTable.jsx
import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { Phone, CheckCircle2, XCircle, Clock, Building2 } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
 import { ManagerRowSkeleton } from "./ManagersSkeletons";
import { getInitials } from "../companies/helpers";

function formatDate(value) {
  if (!value) return "—";
  try {
    return format(parseISO(value), "d MMM yyyy", { locale: arSA });
  } catch {
    return value;
  }
}

export default function CompanyManagersTable({
  managers = [],
  isLoading,
  isError,
  onRetry,
  skeletonRows = 5,
}) {
  const columns = [
    /* ── Company ── */
    {
      key: "company",
      header: "الشركة",
      render: (mgr) => {
        const company = mgr.company || {};
        return (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 shrink-0 rounded bg-muted overflow-hidden flex items-center justify-center">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[150px]">
              {company.name || "—"}
            </span>
          </div>
        );
      },
    },

    /* ── Name + Email ── */
    {
      key: "name",
      header: "المدير",
      render: (mgr) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
            {getInitials(mgr.name)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-xs sm:text-sm truncate">
              {mgr.name || "بدون اسم"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {mgr.email || "—"}
            </p>
          </div>
        </div>
      ),
    },

    /* ── Phone ── */
    {
      key: "phone",
      header: "رقم الهاتف",
      render: (mgr) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" dir="ltr">
          <Phone className="h-3.5 w-3.5" />
          {mgr.phone || "—"}
        </span>
      ),
    },

    /* ── Status ── */
    {
      key: "status",
      header: "الحالة",
      render: (mgr) => {
        if (!mgr.is_active) {
          return (
            <Badge variant="secondary" className="rounded-full text-[10px] bg-red-50 text-red-600">
              <XCircle className="h-3 w-3 mr-1" /> غير نشط
            </Badge>
          );
        }
        
        if (!mgr.invite_accepted_at) {
          return (
            <Badge variant="secondary" className="rounded-full text-[10px] bg-amber-50 text-amber-600">
              <Clock className="h-3 w-3 mr-1" /> بانتظار القبول
            </Badge>
          );
        }

        return (
          <Badge variant="secondary" className="rounded-full text-[10px] bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-3 w-3 mr-1" /> نشط
          </Badge>
        );
      },
    },

    /* ── Joined Date ── */
    {
      key: "created_at",
      header: "تاريخ الانضمام",
      render: (mgr) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(mgr.created_at)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={managers}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyMessage="لا يوجد مدراء مضافين في أي شركة"
      skeletonRows={skeletonRows}
      renderSkeletonRow={() => <ManagerRowSkeleton />}
      getRowKey={(mgr) => `${mgr.id}-${mgr.company?.id}`}
    />
  );
}