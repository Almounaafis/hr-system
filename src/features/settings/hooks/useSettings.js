import { useCrud } from "@/hooks/useCrud";

/**
 * Hook to fetch and update settings data using useCrud
 * @returns {Object} Query result with settings data and update function
 */
export function useSettings() {
  const crud = useCrud({
    queryKey: ["settings"],
    endpoint: "/settings",
    enabled: true,
    staleTime: 300000, // 5 minutes
    select: (data) => data?.data || data,
  });

  // Use updateItem with skipId for PUT request (settings endpoint doesn't require an ID)
  const updateSettings = async (settingsData) => {
    return crud.updateItem({
      endpoint: "/settings",
      id: "", // Placeholder, will be skipped
      body: settingsData,
      method: "put",
      useJsonPayload: true,
      skipId: true, // Skip appending ID to URL
    });
  };

  return {
    ...crud,
    updateSettings,
    updating: crud.updating,
  };
}
