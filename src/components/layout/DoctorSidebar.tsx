import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ScanLine,
  ClipboardList,
  Users,
  ShieldCheck,
  HeartPulse,
  LogOut,
  Settings,
} from "lucide-react";
import { logout, useHealthStore } from "@/lib/health-store";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/doctor/scan", label: "Scan Patient QR", icon: ScanLine },
  { to: "/doctor/patients", label: "My Patients", icon: Users },
  { to: "/doctor/requests", label: "Access Requests", icon: ClipboardList },
  { to: "/doctor/settings", label: "Verification", icon: Settings },
] as const;

export function DoctorSidebar() {
  const { location } = useRouterState();
  const { user } = useHealthStore();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
      <div className="p-5 border-b border-sidebar-border">
        <Link to="/doctor/dashboard" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <HeartPulse className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">Clinician Portal</div>
            <div className="text-[11px] text-muted-foreground -mt-0.5">QR Health Network</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = location.pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              ].join(" ")}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50">
          <div className="size-9 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm">
            {(user?.name || "D").slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate flex items-center gap-1">
              {user?.name || "Doctor"}
              {user?.doctor?.verified && <ShieldCheck className="size-3.5 text-success" />}
            </div>
            <div className="text-[11px] text-muted-foreground truncate">{user?.doctor?.hospital}</div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

export function DoctorMobileNav() {
  const { location } = useRouterState();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border">
      <div className="grid grid-cols-4 max-w-xl mx-auto">
        {items.slice(0, 4).map((it) => {
          const Icon = it.icon;
          const active = location.pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={[
                "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              ].join(" ")}
            >
              <div
                className={[
                  "size-9 rounded-full grid place-items-center transition-all",
                  active ? "bg-primary/10 text-primary" : "",
                ].join(" ")}
              >
                <Icon className="size-4" />
              </div>
              {it.label.split(" ")[0]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}