import { useCrud } from "./useCrud";

export function useProfile() {
  const crud = useCrud({
    queryKey: ["profile"],
    endpoint: "/profile",
    enabled: true,
    select: (data) => data?.data ?? data,
  });

  const updateProfile = async (profileData) => {
    return await crud.updateItem({
      endpoint: "/profile",
      skipId: true,
      method: "put",
      body: profileData,
      useJsonPayload: false, 
    });
  };

  return {
    profile: crud.data,
    isLoading: crud.isLoading,
    isError: crud.isError,
    refetch: crud.refetch,
    updateProfile,
    isUpdating: crud.updating,
  };
}