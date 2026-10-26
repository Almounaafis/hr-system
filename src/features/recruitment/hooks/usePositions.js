// @/features/recruitment/hooks/usePositions.js
import { useMemo } from "react";
import { useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useCrud } from "@/hooks/useCrud";
import { handleError, handleSuccess } from "@/lib/errorHandlers";

// ─────────────────────────────────────────────────────────────────────────────
// Internal Helper (Extract Array)
// ─────────────────────────────────────────────────────────────────────────────
function normalizeList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PRIVATE: Admin Positions (GET /recruitment/positions)
// ─────────────────────────────────────────────────────────────────────────────
export function usePositions() {
  const crud = useCrud({
    queryKey: ["positions"],
    endpoint: "/recruitment/positions",
    useJsonPayload: true, // POST/PATCH take JSON
  });

  const positions = useMemo(() => normalizeList(crud.data), [crud.data]);

  const createPosition = (values) => {
    return crud.createItem({
      endpoint: "/recruitment/positions",
      body: values,
      useJsonPayload: true,
    });
  };

  const updatePosition = (id, values) => {
    return crud.updateItem({
      endpoint: "/recruitment/positions",
      id,
      method: "patch", // or "put" depending on backend, usually patch for partial or put for full
      body: values,
      useJsonPayload: true,
    });
  };

  const deletePosition = (id) => crud.deleteItem(`/recruitment/positions/${id}`);

  return {
    ...crud,
    positions,
    createPosition,
    updatePosition,
    deletePosition,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PRIVATE: Single Position (GET /recruitment/positions/{id})
// ─────────────────────────────────────────────────────────────────────────────
export function usePosition(id, { enabled = true } = {}) {
  const crud = useCrud({
    queryKey: ["positions", id],
    endpoint: id ? `/recruitment/positions/${id}` : "",
    enabled: enabled && !!id,
  });

  const position = useMemo(() => {
    const raw = crud.data;
    if (!raw) return null;
    return raw.data || raw;
  }, [crud.data]);

  return { ...crud, position };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PUBLIC: Careers Page Positions (GET /recruitment/public/positions)
// ─────────────────────────────────────────────────────────────────────────────
export function usePublicPositions(companyId, { enabled = true } = {}) {
  const crud = useCrud({
    queryKey: ["public-positions", companyId],
    endpoint: companyId ? `/recruitment/public/positions` : "",
    enabled: enabled && !!companyId,
    // If the endpoint requires company_id as a query param, useCrud doesn't support params directly.
    // We will use fetchItem / useQuery via useCrud's default GET with params if we had a wrapper.
    // Since your useCrud doesn't accept params, I'll use a custom useQuery below.
  });

  // Actually, we need to pass company_id as a query param. Let's use useQueries or custom useQuery.
  return crud; // fallback
}

// Better implementation for Public Positions using standard react-query
import { useQuery } from "@tanstack/react-query";

export function usePublicCompanyPositions(companyId) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["public-positions", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const res = await api.get("/recruitment/public/positions", {
        params: { company_id: companyId },
      });
      return res.data;
    },
    enabled: !!companyId,
  });

  const positions = useMemo(() => normalizeList(data), [data]);

  return { positions, isLoading, isError, refetch };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PUBLIC: Single Public Position (GET /recruitment/public/positions/{id})
// ─────────────────────────────────────────────────────────────────────────────
export function usePublicPosition(id) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["public-position", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`/recruitment/public/positions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const position = useMemo(() => {
    if (!data) return null;
    return data.data || data;
  }, [data]);

  return { position, isLoading, isError, refetch };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PUBLIC: Apply to Position (POST /recruitment/public/apply)
// ─────────────────────────────────────────────────────────────────────────────
export function useApplyToPosition() {
  const { mutateAsync: apply, isPending: isApplying } = useMutation({
    mutationFn: async ({ position, formData }) => {
      const fd = new FormData();
      
      fd.append("company_id", position.company_id);
      fd.append("position_id", position.id);
      fd.append("full_name", formData.full_name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone || "");
      fd.append("extra_data", formData.extra_data || "");

      // Append dynamic custom fields
      if (position.custom_fields && formData.custom_fields) {
        position.custom_fields.forEach((field) => {
          const value = formData.custom_fields[field.field_name];
          if (value !== undefined && value !== null) {
            // If it's an array (multiple options), append each
            if (Array.isArray(value)) {
              value.forEach((v) => fd.append(`custom_fields[${field.field_name}][]`, v));
            } else {
              fd.append(`custom_fields[${field.field_name}]`, value);
            }
          }
        });
      }

      const res = await api.post("/recruitment/public/apply", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (response) => {
      handleSuccess(response, "تم إرسال طلبك بنجاح");
    },
    onError: handleError,
  });

  return { apply, isApplying };
}