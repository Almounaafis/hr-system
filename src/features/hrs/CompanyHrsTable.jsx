import { format, parseISO } from "date-fns";
import { arSA } from "date-fns/locale";
import { Phone, CheckCircle2, XCircle, Clock, Building2 } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { HrRowSkeleton } from "./CompaniesSkeletons";
import { getInitials } from "../companies/helpers";

function formatDate(value) {
  if (!value) return "—";
  try {
    return format(parseISO(value), "d MMM yyyy", { locale: arSA });
  } catch {
    return value;
  }
}

export default function CompanyHrsTable({
  hrs = [],
  isLoading,
  isError,
  onRetry,
  skeletonRows = 5,
}) {
  const columns = [
    /* ── Name + Email ── */
    {
      key: "name",
      header: " HR",
      render: (hr) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
            {getInitials(hr.name)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-xs sm:text-sm truncate">
              {hr.name || "بدون اسم"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {hr.email || "—"}
            </p>
          </div>
        </div>
      ),
    },

    
    /* ── Company ── */
    {
      key: "company",
      header: "الشركة",
      render: (hr) => {
        const company = hr.company || {};
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


    /* ── Phone ── */
    {
      key: "phone",
      header: "رقم الهاتف",
      render: (hr) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" dir="ltr">
          <Phone className="h-3.5 w-3.5" />
          {hr.phone || "—"}
        </span>
      ),
    },

    /* ── Status ── */
    {
      key: "status",
      header: "الحالة",
      render: (hr) => {
        if (!hr.is_active) {
          return (
            <Badge variant="secondary" className="rounded-full text-[10px] bg-red-50 text-red-600">
              <XCircle className="h-3 w-3 mr-1" /> غير نشط
            </Badge>
          );
        }
        
        if (!hr.invite_accepted_at) {
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
      render: (hr) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(hr.created_at)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={hrs}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyMessage="لا يوجد محاسبين مضافين في أي شركة"
      skeletonRows={skeletonRows}
      renderSkeletonRow={() => <HrRowSkeleton />}
      getRowKey={(hr) => `${hr.id}-${hr.company?.id}`}
    />
  );
}