import { useCrud } from "@/hooks/useCrud";
import { useMemo } from "react";

export function useNetworksData() {
  const crud = useCrud({
    queryKey: ["networks"],
    endpoint: "/networks",
    useJsonPayload: true,
  });

  const networks = useMemo(() => {
    return Array.isArray(crud.data?.data) ? crud.data.data : crud.data || [];
  }, [crud.data]);

  const { data: rawBranches = [] } = useCrud({
    queryKey: ["branches"],
    endpoint: "/branches",
  });

  const branches = useMemo(() => {
    return Array.isArray(rawBranches?.data) ? rawBranches.data : rawBranches || [];
  }, [rawBranches]);

  return {
    ...crud,
    networks,
    branches,
  };
}
