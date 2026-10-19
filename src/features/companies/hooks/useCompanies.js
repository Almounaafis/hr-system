import { useMemo } from "react";
import { useCrud } from "@/hooks/useCrud";

/**
 * Extracts the companies array from a response shaped like:
 *   { success: true, message: "...", data: [ ... ] }
 * or the already-unwrapped array (after useCrud's `select` normalizes it).
 */
function normalizeList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return [];
}

/**
 * Extracts a single company from a response shaped like:
 *   { success: true, message: "نجاح", data: { ...company } }
 * or the already-unwrapped object.
 */
function normalizeOne(raw) {
  if (!raw) return null;
  if (raw?.data && !Array.isArray(raw.data)) return raw.data;
  return raw;
}

/**
 * Build the FormData payload for POST/PATCH /companies.
 * - name, type, timezone: plain strings
 * - branches, departments: string arrays → repeated keys
 *   (so the server sees `branches[]=جدة&branches[]=الرياض`)
 * - logo, stamp: File objects → appended as files
 *
 * The current useCrud.updateItem / createItem handle FormData passthrough
 * when `useJsonPayload: false`.
 */
function buildCompanyFormData(values = {}) {
  const fd = new FormData();

  if (values.name !== undefined) fd.append("name", values.name ?? "");
  if (values.type !== undefined) fd.append("type", values.type ?? "");
  if (values.timezone !== undefined) fd.append("timezone", values.timezone ?? "");

  // branches: string[]
  if (Array.isArray(values.branches)) {
    values.branches.forEach((b) => {
      if (b != null && b !== "") fd.append("branches[]", b);
    });
  }

  // departments: string[]
  if (Array.isArray(values.departments)) {
    values.departments.forEach((d) => {
      if (d != null && d !== "") fd.append("departments[]", d);
    });
  }

  // Files — only append if they are actual File/Blob instances
  if (values.logo instanceof File || values.logo instanceof Blob) {
    fd.append("logo", values.logo);
  }
  if (values.stamp instanceof File || values.stamp instanceof Blob) {
    fd.append("stamp", values.stamp);
  }

  return fd;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main hook — all companies (GET /companies)
// ─────────────────────────────────────────────────────────────────────────────
export function useCompanies() {
  const crud = useCrud({
    queryKey: ["companies"],
    endpoint: "/companies",
    useJsonPayload: false, // we send FormData on create/update
  });

  const companies = useMemo(() => normalizeList(crud.data), [crud.data]);

  /**
   * POST /companies
   * @param {{
   *   name: string,
   *   type: string,
   *   branches?: string[],
   *   departments?: string[],
   *   timezone?: string,
   *   logo?: File,
   *   stamp?: File,
   * }} values
   */
  const createCompany = (values) => {
    const fd = buildCompanyFormData(values);
    return crud.createItem({
      endpoint: "/companies",
      body: fd,
      useJsonPayload: false,
    });
  };

  /**
   * PATCH /companies/{companyId}
   * @param {string} companyId
   * @param {Parameters<typeof createCompany>[0]} values
   */
  const updateCompany = (companyId, values) => {
    const fd = buildCompanyFormData(values);
    return crud.updateItem({
      endpoint: "/companies",
      id: companyId,
      method: "patch",
      body: fd,
      useJsonPayload: false,
    });
  };

  /**
   * DELETE /companies/{companyId}
   */
  const deleteCompany = (companyId) => crud.deleteItem(`/companies/${companyId}`);

  /**
   * GET /companies/{companyId}
   * Uses fetchItem so we don't share the list cache with a single record.
   */
  const getCompanyById = (companyId) =>
    crud.fetchItem({ endpoint: `/companies/${companyId}` }).then(normalizeOne);

  return {
    ...crud,
    companies,
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// "My" companies (GET /companies/my)
// Kept in a separate hook so queryKey is isolated from the full list.
// ─────────────────────────────────────────────────────────────────────────────
export function useMyCompanies() {
  const crud = useCrud({
    queryKey: ["companies", "my"],
    endpoint: "/companies/my",
  });

  const companies = useMemo(() => normalizeList(crud.data), [crud.data]);

  return { ...crud, companies };
}

// ─────────────────────────────────────────────────────────────────────────────
// Single company by id (GET /companies/{companyId}) — declarative hook
// ─────────────────────────────────────────────────────────────────────────────
export function useCompany(companyId, { enabled = true } = {}) {
  const crud = useCrud({
    queryKey: ["companies", companyId],
    endpoint: companyId ? `/companies/${companyId}` : "",
    enabled: enabled && !!companyId,
  });

  const company = useMemo(() => normalizeOne(crud.data), [crud.data]);

  return { ...crud, company };
}