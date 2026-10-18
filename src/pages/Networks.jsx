// @/features/networks/Networks.jsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import logger from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { useNetworksData } from '@/features/networks/hooks/useNetworks';
import NetworkModal from '@/features/networks/NetworkModal';
import NetworksTable from '@/features/networks/NetworksTable';

export default function Networks() {
  const {
    networks,
    branches,
    isLoading,
    isError,
    refetch,
    createItem,
    updateItem,
    deleteItem,
    creating,
    updating,
  } = useNetworksData();

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
    if (window.confirm('هل أنت متأكد من حذف هذه الشبكة؟')) {
      await deleteItem(`/networks/${id}`);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingNetwork) {
        await updateItem({
          endpoint: `/networks`,
          id: editingNetwork.id,
          body: data,
          method: 'patch',
          useJsonPayload: true,
        });
      } else {
        await createItem({ endpoint: '/networks', body: data, useJsonPayload: true });
      }
      setIsModalOpen(false);
    } catch (error) {
      logger.error('Error saving network', error);
    }
  };

  return (
    <div dir="rtl" className="space-y-6 p-2 sm:p-1">
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

      <div className="bg-card rounded-xl border border-border shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-semibold">الشبكات المعتمدة</h2>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
            {isLoading || isError ? '—' : networks.length}
          </span>
        </div>

        <NetworksTable
          networks={networks}
          isLoading={isLoading}
          isError={isError}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRetry={refetch}
        />
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