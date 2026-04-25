import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DoctorSidebar, DoctorMobileNav } from "@/components/layout/DoctorSidebar";
import { getUser } from "@/lib/health-store";

export const Route = createFileRoute("/doctor")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const u = getUser();
    if (!u) throw redirect({ to: "/login" });
    if (u.role !== "doctor") throw redirect({ to: "/dashboard" });
  },
  component: DoctorLayout,
});

function DoctorLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      <DoctorSidebar />
      <main className="flex-1 min-w-0 pb-24 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
      <DoctorMobileNav />
    </div>
  );
}