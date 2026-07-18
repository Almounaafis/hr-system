import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Bell, Menu, ChevronDown, CheckCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
// import { ThemeToggle } from '@/components/shared/ThemeToggle';
import userIcon from "../../assets/user-icon.png";
import { useNotificationsData } from '../dashboard/notifications/hooks/useNotificationsData';
import { useMemo } from 'react';

export default function TopNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  // جلب الإشعارات الحقيقية
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    unreadCount = 0,
  } = useNotificationsData({ pageSize: 5 }); // فقط 5 للـ Dropdown

  // Mapping للـ Dropdown (نأخذ أحدث 5)
  const recentNotifications = useMemo(() => {
    return notifications.slice(0, 5).map((n) => ({
      id: n.id,
      title: n.title,
      description: n.body || n.message || n.description || "",
      time: n.created_at, // سنستخدم formatTimestamp لاحقًا
      read: n.is_read,
    }));
  }, [notifications]);

  const handleMarkOneRead = (id) => {
    markAsRead(id);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <Button variant="ghost" size="icon" className="-ml-1 lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        {/* <ThemeToggle /> */}

        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            collisionPadding={12}
            className="p-0 w-[calc(100vw-24px)] sm:w-80 max-w-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">الإشعارات</span>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-destructive text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead} 
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  تحديد الكل كمقروء
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div
              className="overflow-y-auto divide-y divide-border"
              style={{ maxHeight: "min(340px, calc(100dvh - 120px))" }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                  <Bell className="h-8 w-8 opacity-30" />
                  <p className="text-sm">لا توجد إشعارات</p>
                </div>
              ) : (
                recentNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkOneRead(n.id)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted ${
                      !n.read ? "bg-primary/10" : "bg-background"
                    }`}
                  >
                    <div className="flex-shrink-0 h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-base shadow-sm">
                      <Bell className="text-gray-500 w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 text-right" dir="rtl">
                      <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                        {n.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 mt-1">
                        {new Date(n.time).toLocaleDateString('ar-EG')} • {new Date(n.time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.read && <span className="flex-shrink-0 mt-1.5 h-2 w-2 rounded-full bg-primary" />}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <button
              onClick={() => navigate('/notifications')}
              className="w-full text-center text-xs text-primary hover:underline font-medium border-t border-border px-4 py-2.5"
            >
              عرض كل الإشعارات
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <ChevronDown className="text-muted-foreground w-4 h-4" />
              <div>
                <p className="text-foreground text-sm font-medium text-left">{user?.name || 'المستخدم'}</p>
                <p className="text-xs text-muted-foreground text-left">{user?.role || 'الشركة'}</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full border shadow-sm bg-muted">
                {user?.profile_image_url ? (
                  <img src={user.profile_image_url} alt="user" className="h-4 w-4 rounded-full" />
                ) : (
                  <img src={userIcon} alt="user icon" className="h-4 w-4 dark:invert" />
                )}
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || 'حسابي'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" /><span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Bell className="mr-2 h-4 w-4" /><span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /><span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}