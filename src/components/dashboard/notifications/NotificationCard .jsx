// NotificationCard.jsx
import { Loader2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const NotificationCard = ({
  id,
  image,
  title,
  description,
  badge,
  isUnread = false,
  timestamp,
  onMarkRead,
  onDelete,
  isMarking = false,
  isDeleting = false,
}) => {
  const handleCardClick = () => {
    if (isUnread && onMarkRead) onMarkRead(id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(id);
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`relative mb-5 mt-4 p-4 sm:px-6 transition-opacity ${
        isUnread ? "rounded-tr-[2px] rounded-br-[2px] cursor-pointer" : ""
      } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* unread indicator */}
      {isUnread && <div className="absolute top-0 right-0 h-full w-1 bg-[#0F9D8B]" />}

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        {/* LEFT CONTENT */}
        <div className="flex gap-3 sm:gap-4">
          {image && (
            <img src={image} alt="notification" className="w-10 h-10 flex-shrink-0" />
          )}

          <div className="flex-1">
            <h1 className="text-base sm:text-xl font-bold text-foreground">{title}</h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-1 sm:mt-2">
              {description}
            </p>

            {badge && (
              <div
                className="flex items-center w-fit justify-center px-4 h-[30px] rounded-3xl text-sm sm:text-md mt-2"
                style={{ backgroundColor: badge.bg, color: badge.color }}
              >
                {badge.label}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
          <div className="flex items-center gap-2 order-2 sm:order-1">
            {isUnread && (
              <span className="w-2 h-2 bg-[#0F9D8B] rounded-full block sm:hidden" />
            )}
            <p className="text-xs sm:text-base text-muted-foreground whitespace-nowrap">
              {timestamp}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            title="حذف الإشعار"
            className="order-1 sm:order-2 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            {isDeleting || isMarking ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;