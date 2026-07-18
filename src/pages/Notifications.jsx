"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCheck } from "lucide-react";

import imageLate from "../assets/notification-late.png";
import imageOrder from "../assets/notification-order.png";
import imageAdd from "../assets/notification-add.png";
import { useNotificationsData } from "@/components/dashboard/notifications/hooks/useNotificationsData";
import NotificationCard from "@/components/dashboard/notifications/NotificationCard ";

// ─── تحويل نوع الإشعار ─────────────────────────────
const NOTIFICATION_META = {
  late: { 
    image: imageLate, 
    badge: { label: "حضور", bg: "#FFF7F0", color: "#E88024" } 
  },
  leave_request: { 
    image: imageOrder, 
    badge: { label: "طلبات", bg: "#DCF1F9", color: "#3D7A83" } 
  },
  new_employee: { 
    image: imageAdd, 
    badge: { label: "الموظفين", bg: "#F3EFFE", color: "#5B3FA6" } 
  },
  new_bonus_request: { 
    image: imageOrder, 
    badge: { label: "مكافآت", bg: "#FEF3E8", color: "#E88024" } 
  },
  default: { 
    image: imageAdd, 
    badge: { label: "عام", bg: "#F3EFFE", color: "#5B3FA6" } 
  },
};

function metaFor(type) {
  return NOTIFICATION_META[type] || NOTIFICATION_META.default;
}

function formatTimestamp(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;

  const isYesterday = 
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toDateString() === 
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).toDateString();

  const time = date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
  if (isYesterday) return `أمس، ${time}`;

  return date.toLocaleDateString("ar-EG");
}

function isSameDay(dateStr, referenceDate) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d.toDateString() === referenceDate.toDateString();
}

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-4 overflow-hidden my-5">
    <p className="text-xl font-bold text-foreground">{label}</p>
    <Separator className="bg-[#C0C0C0]" />
  </div>
);

const Notifications = () => {
  const [uiFilter, setUiFilter] = useState("top");

  const {
    notifications,
    isLoading,
    setStatus,
    markAsRead,
    markingAsRead,
    markAllAsRead,
    removeNotification,
    deletingNotification,
    unreadCount = 0,
  } = useNotificationsData({ pageSize: 20 });

  const handleFilterChange = (value) => {
    if (!value) return;
    setUiFilter(value);
    const statusMap = { top: "all", bottom: "unread", left: "read" };
    setStatus(statusMap[value]);
  };

  // Mapping الإشعارات
  const mappedNotifications = useMemo(() => {
    return notifications.map((n) => {
      const meta = metaFor(n.type);
      return {
        id: n.id,
        image: meta.image,
        title: n.title,
        description: n.body || n.message || n.description || "",
        badge: meta.badge,
        isUnread: !n.is_read,
        timestamp: formatTimestamp(n.created_at),
        createdAt: n.created_at,
      };
    });
  }, [notifications]);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const todayList = mappedNotifications.filter((n) => isSameDay(n.createdAt, today));
  const yesterdayList = mappedNotifications.filter((n) => isSameDay(n.createdAt, yesterday));
  const olderList = mappedNotifications.filter(
    (n) => !isSameDay(n.createdAt, today) && !isSameDay(n.createdAt, yesterday)
  );

  const readCount = mappedNotifications.filter((n) => !n.isUnread).length;

  return (
    <section>
      {/* HEADER */}
      <Card className="mt-5 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-foreground">الاشعارات</h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              لديك {unreadCount} اشعارات غير مقروءة
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="bg-[#EDEFF3] h-[50px] w-full sm:w-[367px] flex items-center rounded-lg p-1">
              <ToggleGroup
                type="single"
                value={uiFilter}
                onValueChange={handleFilterChange}
                className="w-full h-full gap-2"
              >
                {[
                  { value: "bottom", label: "غير مقروء", count: unreadCount },
                  { value: "left", label: "مقروء", count: readCount },
                  { value: "top", label: "الكل", count: unreadCount + readCount },
                ].map(({ value, label, count }) => (
                  <ToggleGroupItem
                    key={value}
                    value={value}
                    aria-label={label}
                    className={`
                      flex-1 h-full flex items-center justify-center gap-1.5 rounded-lg border-0
                      text-xs sm:text-sm font-medium transition-colors
                      data-[state=on]:bg-background data-[state=on]:text-[#4E9DA8]
                      data-[state=off]:bg-transparent data-[state=off]:text-muted-foreground
                      [&[data-state=on]_span]:bg-[#4E9DA8] [&[data-state=on]_span]:text-white
                      [&[data-state=off]_span]:bg-[#C0C0C0] [&[data-state=off]_span]:text-white
                    `}
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0">
                      {count}
                    </span>
                    {label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <Button
              variant="outline"
              className="gap-2 h-10 sm:h-[50px] whitespace-nowrap"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4" />
              تحديد الكل كمقروء
            </Button>
          </div>
        </div>
      </Card>

      {/* LOADING */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {!isLoading && (
        <>
          {todayList.length > 0 && (
            <>
              <SectionDivider label="اليوم" />
              {todayList.map((n) => (
                <NotificationCard
                  key={n.id}
                  {...n}
                  onMarkRead={markAsRead}
                  onDelete={removeNotification}
                  isMarking={markingAsRead}
                  isDeleting={deletingNotification}
                />
              ))}
            </>
          )}

          {yesterdayList.length > 0 && (
            <>
              <SectionDivider label="أمس" />
              {yesterdayList.map((n) => (
                <NotificationCard
                  key={n.id}
                  {...n}
                  onMarkRead={markAsRead}
                  onDelete={removeNotification}
                  isMarking={markingAsRead}
                  isDeleting={deletingNotification}
                />
              ))}
            </>
          )}

          {olderList.length > 0 && (
            <>
              <SectionDivider label="أقدم" />
              {olderList.map((n) => (
                <NotificationCard
                  key={n.id}
                  {...n}
                  onMarkRead={markAsRead}
                  onDelete={removeNotification}
                  isMarking={markingAsRead}
                  isDeleting={deletingNotification}
                />
              ))}
            </>
          )}

          {mappedNotifications.length === 0 && (
            <p className="text-center text-muted-foreground mt-10">لا توجد اشعارات</p>
          )}
        </>
      )}
    </section>
  );
};

export default Notifications;