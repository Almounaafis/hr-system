// @/features/networks/NetworksTable.jsx
import { Wifi, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/shared/DataTable";
import { NetworkRowSkeleton } from "@/components/skeletons/NetworksSkeletons";

export default function NetworksTable({
  networks,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onRetry,
}) {
  const columns = [
    {
      key: "ssid",
      header: "اسم الشبكة",
      render: (network) => (
        <div className="flex items-center gap-2 font-medium">
          <div className="flex items-center justify-center w-[35px] h-[35px] rounded-sm bg-[#EAF4F5]">
            <Wifi className="h-4 w-4 text-primary" />
          </div>
          {network.ssid}
        </div>
      ),
    },
    {
      key: "branch",
      header: "الفرع",
      cellClassName: "text-muted-foreground",
      render: (network) => network.branch?.name || network.branch || "—",
    },
    {
      key: "status",
      header: "الحالة",
      render: () => (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          مفعلة
        </div>
      ),
    },
    {
      key: "mac_address",
      header: "عنوان MAC",
      cellClassName: "text-muted-foreground",
      render: (network) => network.mac_address || "—",
    },
    {
      key: "description",
      header: "وصف الشبكة",
      cellClassName: "text-muted-foreground",
      render: (network) => network.description || "—",
    },
    {
      key: "actions",
      header: "الإجراءات",
      render: (network) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(network)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(network.id)}
            className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={networks}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyMessage="لا توجد شبكات مضافة"
      skeletonRows={5}
      renderSkeletonRow={() => <NetworkRowSkeleton />}
      getRowKey={(network) => network.id}
    />
  );
}