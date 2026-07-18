import { useCrud } from "@/hooks/useCrud";
import { useMemo, useState } from "react";
 
export function useNotificationsData({ pageSize = 10 } = {}) {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const endpoint = `/notifications?status=${status}&page=${page}&limit=${pageSize}`;

  const {
    data: rawData,
    isLoading,
    isRefetching,
    refetch,
    updateItem,
    updating,
    deleteItem,
    deleting,
  } = useCrud({
    queryKey: ["notifications", status, page],
    endpoint,
    select: (res) => res,
  });

  const notifications = useMemo(() => {
    // حسب الـ response اللي بعته
    return rawData?.data?.notifications ?? [];
  }, [rawData]);

  const unreadCount = useMemo(() => {
    return rawData?.data?.unread_count ?? 0;
  }, [rawData]);

  const markAsRead = (notificationId) =>
    updateItem({
      endpoint: `/notifications/${notificationId}/read`,
      id: notificationId,
      skipId: true,
      method: "patch",
      useJsonPayload: true,
      body: {},
    });

  const markAllAsRead = () =>
    updateItem({
      endpoint: `/notifications/read-all`,
      skipId: true,
      method: "patch",
      useJsonPayload: true,
      body: {},
    });

  const removeNotification = (notificationId) =>
    deleteItem(`/notifications/${notificationId}`);

  return {
    notifications,
    unreadCount,
    isLoading: isLoading || isRefetching,
    status,
    setStatus: (s) => {
      setStatus(s);
      setPage(1);
    },
    page,
    setPage,
    refetch,
    markAsRead,
    markingAsRead: updating,
    markAllAsRead,
    removeNotification,
    deletingNotification: deleting,
  };
}