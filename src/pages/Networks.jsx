import { useState } from "react";
import { Plus, Wifi, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNetworksData } from "@/features/networks/hooks/useNetworks";
import NetworkModal from "@/features/networks/NetworkModal";

export default function Networks() {
  const { networks, branches, isLoading, createItem, updateItem, deleteItem, creating, updating } = useNetworksData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState(null);

  const handleAddClick = () => {
    setEditingNetwork(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (network) => {
    setEditingNetwork(network);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الشبكة؟")) {
      await deleteItem(`/networks/${id}`);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingNetwork) {
        await updateItem({ endpoint: `/networks`, id: editingNetwork.id, body: data, method: "patch", useJsonPayload: true });
      } else {
        await createItem({ endpoint: "/networks", body: data, useJsonPayload: true });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving network", error);
    }
  };

  return (
    <div dir="rtl" className="space-y-6 p-2 sm:p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">شبكات الشركة</h1>
          <p className="text-sm text-muted-foreground mt-1">
            أضف وأدر شبكات Wi-Fi المعتمدة للسماح للموظفين بتسجيل الحضور والانصراف عند الاتصال بها.
          </p>
        </div>
        <Button onClick={handleAddClick} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> اضافة شبكة
        </Button>
      </div>

      {/* Content */}
      <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold">الشبكات المعتمدة</h2>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            {networks.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="py-3 px-4 font-medium rounded-tr-lg">اسم الشبكة</th>
                <th className="py-3 px-4 font-medium">الفرع</th>
                <th className="py-3 px-4 font-medium">عنوان MAC</th>
                <th className="py-3 px-4 font-medium">وصف الشبكة</th>
                <th className="py-3 px-4 font-medium">الحالة</th>
                <th className="py-3 px-4 font-medium rounded-tl-lg">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-muted-foreground">
                    جاري التحميل...
                  </td>
                </tr>
              ) : networks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-muted-foreground">
                    لا توجد شبكات مضافة
                  </td>
                </tr>
              ) : (
                networks.map((network) => (
                  <tr key={network.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center  gap-2 font-medium">
                        <div className="flex items-center justify-center w-[35px] h-[35px] rounded-sm bg-[#EAF4F5]">
                          <Wifi className="h-4 w-4 text-primary" />
                        </div>
                        {network.ssid}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {network.branch?.name || network.branch || "—"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        مفعلة
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {network.mac_address || "—"}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {network.description || "—"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(network)}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(network.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NetworkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingNetwork={editingNetwork}
        branches={branches}
        isSaving={creating || updating}
      />
    </div>
  );
}
