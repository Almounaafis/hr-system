import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequestBadge } from "./StatusPill";
import { mapRequestToItem } from "./hooks/latestRequests.utils";

/* ===================== */
/* Request Item */
/* ===================== */
const RequestItem = memo(function RequestItem({ item }) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div
        className={`
          w-10 h-10 sm:w-[56px] sm:h-[56px]
          rounded-full
          flex items-center justify-center
          text-sm sm:text-md font-semibold
          flex-shrink-0
          ${item.avatarBg} ${item.avatarColor}
        `}
      >
        {item.initials}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm sm:text-xl font-medium text-foreground leading-snug truncate">
          {item.name}
        </p>
        <p className="text-xs sm:text-md text-muted-foreground mt-0.5">
          {item.date}
        </p>
      </div>

      <RequestBadge type={item.badgeType} className="text-xs sm:text-sm">
        {item.badge}
      </RequestBadge>
    </div>
  );
});

/* ===================== */
/* Skeleton Row */
/* ===================== */
const RequestItemSkeleton = memo(function RequestItemSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="w-10 h-10 sm:w-[56px] sm:h-[56px] rounded-full bg-muted animate-pulse flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3.5 sm:h-4 w-2/3 rounded bg-muted animate-pulse" />
        <div className="h-2.5 sm:h-3 w-1/3 rounded bg-muted animate-pulse" />
      </div>
      <div className="h-5 sm:h-6 w-14 sm:w-16 rounded-full bg-muted animate-pulse flex-shrink-0" />
    </div>
  );
});

/* ===================== */
/* Latest Requests Card */
/* ===================== */
const LatestRequestsCard = memo(function LatestRequestsCard({
  data,
  onViewRequests,
  isLoading, // ← كانت ناقصة من الـ props
}) {
  const items = (data ?? []).map(mapRequestToItem);

  return (
    <Card className="border-border bg-background col-span-1">
      <CardHeader
        className="
          flex flex-col gap-2
          sm:flex-row sm:items-center sm:justify-between
          pb-2 border-b border-border
        "
      >
        <CardTitle className="text-lg sm:text-2xl font-semibold text-foreground">
          أحدث الطلبات
        </CardTitle>

        <Button
          variant="outline"
          size="sm"
          onClick={onViewRequests}
          className="
            h-7 sm:h-8
            px-3 text-xs sm:text-sm font-medium
            border-[#DCF1F9]
            text-primary
            bg-[#DCF1F9]
            self-start sm:self-auto
          "
        >
          عرض الطلبات
        </Button>
      </CardHeader>

      <CardContent className="px-3 sm:px-4 pb-4">
        <div className="divide-y divide-border">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <RequestItemSkeleton key={i} />)
            : items.map((item) => <RequestItem key={item.id} item={item} />)}
        </div>
      </CardContent>
    </Card>
  );
});

export default LatestRequestsCard;