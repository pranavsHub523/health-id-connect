import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, QrCode, Siren, User, LineChart } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/qr-code", label: "QR", icon: QrCode },
  { to: "/sos", label: "SOS", icon: Siren, danger: true },
  { to: "/analytics", label: "Stats", icon: LineChart },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function MobileNav() {
  const { location } = useRouterState();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border">
      <div className="grid grid-cols-5 max-w-xl mx-auto">
        {items.map((it) => {
          const Icon = it.icon;
          const active = location.pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={[
                "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
                it.danger ? "text-emergency" : "",
              ].join(" ")}
            >
              <div
                className={[
                  "size-9 rounded-full grid place-items-center transition-all",
                  it.danger
                    ? "bg-emergency text-emergency-foreground shadow-emergency"
                    : active
                      ? "bg-primary/10 text-primary"
                      : "",
                ].join(" ")}
              >
                <Icon className="size-4" />
              </div>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
