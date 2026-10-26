// AppSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  DollarSign,
  Settings,
  Bell,
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
  Wifi,
  Building2,
  User,
  UserCog,
  Package,
} from "lucide-react";

import { cn, getInitials } from "@/lib/utils";
import basma from "@/assets/basma.svg";
import useAuthStore from "@/store/useAuthStore";

const ADMIN_HOME = "/dashboard/admin";

// HR + Manger + employee links
const userNavigation = [
  { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
  { name: "الطلبات", href: "/requests", icon: ClipboardList },
  { name: "الموظفين", href: "/employees", icon: Users },
  { name: "الحضور والانصراف", href: "/attendance", icon: CalendarCheck },
  { name: "الرواتب", href: "/payroll", icon: DollarSign },
  { name: "التوظيف", href: "/recruitment", icon: DollarSign },
  // { name: "طلبات التوظيف", href: "/applications", icon: ClipboardList },
  // { name: "المقابلات", href: "/interviews", icon: CalendarCheck },
  { name: "المتدربين", href: "/trainees", icon: CalendarCheck },
  { name: "العهد", href: "/custodies", icon: Package },
  { name: "شبكات الحضور", href: "/networks", icon: Wifi },
  { name: "الإعدادات", href: "/settings", icon: Settings },
  { name: "الإشعارات", href: "/notifications", icon: Bell },
];

// Super admin links (all under /dashboard/admin)
const adminNavigation = [
  { name: "لوحة التحكم", href: ADMIN_HOME, icon: LayoutDashboard, exact: true },
  { name: "الشركات", href: `${ADMIN_HOME}/companies`, icon: Building2 },
  { name: "الإعدادات", href: `${ADMIN_HOME}/settings`, icon: Settings },
  { name: "الإشعارات", href: `${ADMIN_HOME}/notifications`, icon: Bell },
];

export default function AppSidebar({ isOpen, collapsed, onToggle }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const closeOnMobile = () => isOpen && onToggle();

  const isSuperAdmin = user?.role === "super_admin";
  const navigation = isSuperAdmin ? adminNavigation : userNavigation;
  const homeHref = isSuperAdmin ? ADMIN_HOME : "/dashboard";
  const profileHref = isSuperAdmin ? `${ADMIN_HOME}/profile` : "/profile";

  const isItemActive = (item) =>
    item.exact
      ? location.pathname === item.href
      : location.pathname === item.href ||
      location.pathname.startsWith(`${item.href}/`);

  return (
    <>
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l bg-sidebar text-sidebar-foreground transition-all duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
          "lg:static lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-72",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link
            to={homeHref}
            onClick={closeOnMobile}
            className={cn("flex items-center gap-3", collapsed && "lg:hidden")}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm md:h-12 md:w-12">
              <img src={basma} alt="Basma" className="h-5 w-5 md:h-8 md:w-8" />
            </div>
            <h1 className="font-bold text-primary md:text-2xl">بصمة</h1>
          </Link>

          <button onClick={onToggle} className="rounded-lg p-2 hover:bg-muted">
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-3">
            <p
              className={cn(
                "mb-2 px-3 text-xs font-medium text-muted-foreground",
                collapsed && "lg:hidden",
              )}
            >
              {isSuperAdmin ? "إدارة النظام" : "الإدارة الرئيسية"}
            </p>

            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeOnMobile}
                    title={item.name}
                    className={cn(
                      "flex h-12 items-center justify-between rounded-xl px-3 transition-all duration-300",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className={cn(collapsed && "lg:hidden")}>
                        {item.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="border-t p-4">
          <Link
            to={profileHref}
            onClick={closeOnMobile}
            className={cn(
              "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50",
              collapsed && "lg:justify-center",
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {user?.profile_image_url ? (
                <img
                  src={user.profile_image_url}
                  alt="user"
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className={cn("flex flex-col", collapsed && "lg:hidden")}>
              <span className="text-sm font-medium">
                {user?.name || "المستخدم"}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.role || "HR Manager"}
              </span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}