import { useCrud } from "@/hooks/useCrud";

/**
 * Hook to fetch and manage shifts data using useCrud
 * @returns {Object} Query result with shifts data and CRUD functions
 */
export function useShifts() {
  const crud = useCrud({
    queryKey: ["shifts"],
    endpoint: "/shifts",
    enabled: true,
    staleTime: 300000, // 5 minutes
    select: (data) => data?.data || data,
    useJsonPayload: true,
  });

  // Create shift
  const createShift = async (shiftData) => {
    return crud.createItem({
      endpoint: "/shifts",
      body: shiftData,
      useJsonPayload: true,
    });
  };

  // Update shift
  const updateShift = async (shiftId, shiftData) => {
    return crud.updateItem({
      endpoint: "/shifts",
      id: shiftId,
      body: shiftData,
      method: "patch",
      useJsonPayload: true,
    });
  };

  // Delete shift
  const deleteShift = async (shiftId) => {
    return crud.deleteItem(`/shifts/${shiftId}`);
  };

  return {
    ...crud,
    createShift,
    updateShift,
    deleteShift,
    creating: crud.creating,
    updating: crud.updating,
    deleting: crud.deleting,
  };
}
