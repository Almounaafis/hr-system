// @/features/companies/hooks/useCompanyHrs.js
import { useMemo } from "react";
import { useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useCrud } from "@/hooks/useCrud";
import { handleError, handleSuccess } from "@/lib/errorHandlers";

/**
 * Single Company HRs
 */
export function useCompanyHrs(companyId, { enabled = true } = {}) {
  const crud = useCrud({
    queryKey: ["companies", companyId, "hr"],
    endpoint: companyId ? `/companies/${companyId}/hr` : "",
    enabled: enabled && !!companyId,
  });

  const hrs = useMemo(() => {
    const raw = crud.data;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    return [];
  }, [crud.data]);

  return { ...crud, hrs };
}

/**
 * Fetch HRs for ALL companies.
 * Accepts an array of companies and fires a GET for each one,
 * combining the results into a single flat array.
 */
export function useAllCompaniesHrs(companies = []) {
  const queryResults = useQueries({
    queries: companies.map((company) => ({
      queryKey: ["companies", company.id, "hr"],
      queryFn: async () => {
        const res = await api.get(`/companies/${company.id}/hr`);
        return res.data;
      },
      enabled: !!company.id,
      staleTime: 60000,
    })),
  });

  const isLoading = queryResults.some((q) => q.isLoading);
  const isError = queryResults.some((q) => q.isError);
  const refetchAll = () => queryResults.forEach((q) => q.refetch());

  // Flatten all HRs and attach the company context to each HR
  const allHrs = useMemo(() => {
    let combined = [];

    queryResults.forEach((result, index) => {
      if (!result.data) return;
      const company = companies[index];
      
      // Extract array from response
      let hrList = [];
      if (Array.isArray(result.data)) hrList = result.data;
      else if (Array.isArray(result.data?.data)) hrList = result.data.data;

      // Attach company info for display in the global table
      const enrichedHrs = hrList.map((hr) => ({
        ...hr,
        company: {
          id: company.id,
          name: company.name,
          logo_url: company.logo_url,
        },
      }));

      combined = [...combined, ...enrichedHrs];
    });

    return combined;
  }, [queryResults, companies]);

  return { allHrs, isLoading, isError, refetchAll };
}

/**
 * Invite HR
 */
export function useInviteCompanyHr(companyId) {
  const queryClient = useQueryClient();

  const { mutateAsync: inviteHr, isPending: isInviting } = useMutation({
    mutationFn: async (email) => {
      if (!companyId) throw new Error("companyId is required");
      const res = await api.post(
        `/auth/invite-hr/${companyId}`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    },
    onSuccess: (response) => {
      handleSuccess(response, "تم إرسال الدعوة بنجاح");
      // Invalidate both the specific company HRs and the global list
      queryClient.invalidateQueries({ queryKey: ["companies", companyId, "hr"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] }); 
    },
    onError: handleError,
  });

  return { inviteHr, isInviting };
}