// @/features/companies/hooks/useCompanyManagers.js
import { useMemo } from "react";
import { useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useCrud } from "@/hooks/useCrud";
import { handleError, handleSuccess } from "@/lib/errorHandlers";

/**
 * Single Company Managers
 */
export function useCompanyManagers(companyId, { enabled = true } = {}) {
  const crud = useCrud({
    queryKey: ["companies", companyId, "managers"],
    endpoint: companyId ? `/companies/${companyId}/managers` : "",
    enabled: enabled && !!companyId,
  });

  const managers = useMemo(() => {
    const raw = crud.data;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    return [];
  }, [crud.data]);

  return { ...crud, managers };
}

/**
 * Fetch Managers for ALL companies in parallel.
 */
export function useAllCompaniesManagers(companies = []) {
  const queryResults = useQueries({
    queries: companies.map((company) => ({
      queryKey: ["companies", company.id, "managers"],
      queryFn: async () => {
        const res = await api.get(`/companies/${company.id}/managers`);
        return res.data;
      },
      enabled: !!company.id,
      staleTime: 60000,
    })),
  });

  const isLoading = queryResults.some((q) => q.isLoading);
  const isError = queryResults.some((q) => q.isError);
  const refetchAll = () => queryResults.forEach((q) => q.refetch());

  const allManagers = useMemo(() => {
    let combined = [];

    queryResults.forEach((result, index) => {
      if (!result.data) return;
      const company = companies[index];
      
      let managerList = [];
      if (Array.isArray(result.data)) managerList = result.data;
      else if (Array.isArray(result.data?.data)) managerList = result.data.data;

      const enriched = managerList.map((mgr) => ({
        ...mgr,
        company: {
          id: company.id,
          name: company.name,
          logo_url: company.logo_url,
        },
      }));

      combined = [...combined, ...enriched];
    });

    return combined;
  }, [queryResults, companies]);

  return { allManagers, isLoading, isError, refetchAll };
}

/**
 * Invite Manager
 * POST /auth/invite-manager/{companyId}
 */
export function useInviteCompanyManager(companyId) {
  const queryClient = useQueryClient();

  const { mutateAsync: inviteManager, isPending: isInviting } = useMutation({
    mutationFn: async (email) => {
      if (!companyId) throw new Error("companyId is required");
      const res = await api.post(
        `/auth/invite-manager/${companyId}`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    },
    onSuccess: (response) => {
      handleSuccess(response, "تم إرسال الدعوة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["companies", companyId, "managers"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: handleError,
  });

  return { inviteManager, isInviting };
}