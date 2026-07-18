// DashboardLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/layout/AppSidebar";
import TopNavbar from "@/components/layout/TopNavbar";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setMobileOpen((prev) => !prev);
    setCollapsed((prev) =>   !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background" dir="rtl">
      <AppSidebar
        isOpen={mobileOpen}
        collapsed={collapsed}
        onToggle={toggleSidebar}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-background_main p-4 md:p-6 lg:p-8">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}