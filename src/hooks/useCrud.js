import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// ─── Helper Functions ────────────────────────────────────────────────────────
/**
 * استخراج وتنظيف البيانات وإزالة الخقول الفارغة والملفات
 */
function cleanPayload(body, excludeFields = []) {
  return Object.fromEntries(
    Object.entries(body).filter(
      ([k, v]) =>
        v !== null &&
        v !== undefined &&
        v !== "" &&
        !excludeFields.includes(k)
    )
  );
}

/**
 * إضافة الملفات إلى FormData
 */
function appendFiles(formData, files = {}) {
  const fileFields = ["imageCover", "image", "images", "logo"];

  fileFields.forEach((field) => {
    const file = files[field];
    if (!file) return;

    if (field === "images" && Array.isArray(file)) {
      file.forEach((img) => {
        if (img instanceof File) formData.append("images", img);
      });
    } else if (file instanceof File) {
      formData.append(field, file);
    }
  });
}

/**
 * بناء FormData من الـ payload
 */
function buildFormData(payload) {
  const formData = new FormData();

  // إضافة الملفات
  appendFiles(formData, {
    imageCover: payload.imageCover || payload.body?.imageCover,
    image: payload.image || payload.body?.image,
    images: payload.images || payload.body?.images,
    logo: payload.logo || payload.body?.logo,
  });

  // تنظيف البيانات وإضافتها
  const excludedFields = [
    "images",
    "imageCover",
    "image",
    "logo",
    "endpoint",
    "body",
    "data",
  ];
  const cleanedBody = cleanPayload(
    payload.body || payload.data || payload,
    excludedFields
  );

  // إضافة البيانات المنظفة بشكل فردي إلى FormData
  Object.entries(cleanedBody).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, item);
      });
    } else {
      formData.append(key, value);
    }
  });
  return formData;
}

/**
 * معالج الأخطاء الموحد
 */
function handleError(error) {
  const errors = error?.response?.data?.errors;
  if (Array.isArray(errors)) {
    errors.forEach((err) => toast.error(err.message));
  } else {
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "حدث خطأ ما"
    );
  }
}

/**
 * معالج النجاح الموحد
 */
function handleSuccess(response, message, callback) {
  toast.success(response?.message || message);
  callback?.();
  return response;
}

// ─── Main Hook ───────────────────────────────────────────────────────────────
export function useCrud({
  queryKey,
  endpoint,
  enabled = true,
  staleTime = 300000,
  handleCloseModal,
  select: customSelect,
  useJsonPayload = false,
  onSuccess, // Callback إضافي عند النجاح
}) {
  const queryClient = useQueryClient();
  const formattedKey = Array.isArray(queryKey) ? queryKey : [queryKey];

  // ─── READ ────────────────────────────────────────────────────────────────
  const { data, refetch, isLoading, isError, isRefetching } = useQuery({
    queryKey: formattedKey,
    enabled: enabled && !!endpoint,
    queryFn: async () => {
      if (!endpoint) return [];
      const res = await api.get(endpoint);
      return res.data;
    },
    select: (data) => {
      if (customSelect) return customSelect(data);
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      if (Array.isArray(data?.data?.employees)) return data.data.employees;
      return data;
    },
    staleTime,
  });

  // ─── CREATE ──────────────────────────────────────────────────────────────
  const { mutateAsync: createItem, isPending: creating } = useMutation({
    mutationFn: async (payload) => {
      const finalEndpoint = payload.endpoint || endpoint;
      if (!finalEndpoint) throw new Error("Endpoint is required");

      const isJson = payload.useJsonPayload !== undefined ? payload.useJsonPayload : useJsonPayload;

      let res;
      if (isJson) {
        const cleaned = cleanPayload(
          payload.body || payload.data || payload,
          ["endpoint", "body", "data", "useJsonPayload"]
        );
        res = await api.post(finalEndpoint, cleaned, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        const formData = payload.body instanceof FormData ? payload.body : buildFormData(payload);
        res = await api.post(finalEndpoint, formData);
      }
      return res.data;
    },
    onSuccess: (response) => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: formattedKey });
      }
      handleSuccess(response, "تم الإضافة بنجاح", handleCloseModal);
      onSuccess?.(response);
    },
    onError: handleError,
  });

  // ─── UPDATE ──────────────────────────────────────────────────────────────
  const { mutateAsync: updateItem, isPending: updating } = useMutation({
    mutationFn: async ({ endpoint: epArg, id, body, method = 'patch', useJsonPayload: overrideJsonPayload, skipId = false, ...files }) => {
      const finalEndpoint = epArg || endpoint;
      if (!finalEndpoint) throw new Error("Endpoint is required");
      if (!id && !skipId) throw new Error("ID is required");

      const isJson = overrideJsonPayload !== undefined ? overrideJsonPayload : useJsonPayload;
      
      let res;
      let url = finalEndpoint;
      if (!skipId && id) {
        url = `${finalEndpoint}/${id}`;
      }
      
      if (isJson) {
        const cleaned = cleanPayload(body, ["endpoint", "body", "data", "method", "useJsonPayload", "skipId"]);
        res = await api[method.toLowerCase()](url, cleaned, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        const formData = body instanceof FormData ? body : buildFormData({ body, ...files });
        res = await api[method.toLowerCase()](url, formData);
      }
      return res.data;
    },
    onSuccess: (response) => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: formattedKey });
      }
      handleSuccess(response, "تم التحديث بنجاح", handleCloseModal);
      onSuccess?.(response);
    },
    onError: handleError,
  });

  // ─── DELETE ──────────────────────────────────────────────────────────────
  const { mutateAsync: deleteItem, isPending: deleting } = useMutation({
    mutationFn: async (deleteEndpoint) => {
      const res = await api.delete(deleteEndpoint);
      return res.data;
    },
    onSuccess: (response) => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey: formattedKey });
      }
      handleSuccess(response, "تم الحذف بنجاح");
    },
    onError: handleError,
  });
// ─── FETCH ON-DEMAND (GET بدون caching - لتصدير/تحميل الملفات مثلاً) ─────
  const { mutateAsync: fetchItem, isPending: fetching } = useMutation({
    mutationFn: async ({ endpoint: epArg, params, responseType = "json" } = {}) => {
      const finalEndpoint = epArg || endpoint;
      if (!finalEndpoint) throw new Error("Endpoint is required");
      const res = await api.get(finalEndpoint, { params, responseType });
      return res.data;
    },
    onError: handleError,
  });
  // ─── SET DATA (Optimistic Update) ────────────────────────────────────────
  const setData = (updater) => {
    queryClient.setQueryData(formattedKey, (old) => {
      const current = old?.data ?? old;
      const updated = updater(current);
      return { ...old, data: updated };
    });
  };

  return {
    data,
    refetch,
    createItem,
    deleteItem,
    updateItem,
    fetchItem,
    isLoading,
    isError,
    creating,
    deleting,
    updating,
    fetching,
    isRefetching,
    setData,
    queryClient,
  };
}