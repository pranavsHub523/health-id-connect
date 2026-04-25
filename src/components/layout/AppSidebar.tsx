import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  User,
  QrCode,
  Siren,
  Brain,
  Watch,
  Hospital,
  FileText,
  LineChart,
  Settings,
  HeartPulse,
  LogOut,
} from "lucide-react";
import { logout, useHealthStore } from "@/lib/health-store";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Health Profile", icon: User },
  { to: "/qr-code", label: "My QR Code", icon: QrCode },
  { to: "/sos", label: "Emergency SOS", icon: Siren, danger: true },
  { to: "/ai-insights", label: "AI Health Insights", icon: Brain },
  { to: "/wearables", label: "Wearables & IoT", icon: Watch },
  { to: "/hospitals", label: "Hospital Network", icon: Hospital },
  { to: "/records", label: "Medical Records", icon: FileText },
  { to: "/analytics", label: "Health Analytics", icon: LineChart },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppSidebar() {
  const { location } = useRouterState();
  const { user } = useHealthStore();
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
      <div className="p-5 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <HeartPulse className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">QR Health ID</div>
            <div className="text-[11px] text-muted-foreground -mt-0.5">Smart Health Identity</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.danger && !active ? "text-emergency hover:bg-emergency/10 hover:text-emergency" : "",
              ].join(" ")}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg">
          <div className="size-9 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm">
            {(user?.name || "U").slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name || "Guest"}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email || "—"}</div>
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
