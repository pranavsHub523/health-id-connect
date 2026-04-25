import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { useHealthStore } from "@/lib/health-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  QrCode, Siren, Heart, Activity, Droplet, Flame, Brain, Watch, Hospital, ArrowRight, TrendingUp, ShieldCheck,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — QR Health ID" }] }),
  component: Dashboard,
});

const heartData = Array.from({ length: 24 }, (_, i) => ({ t: i, v: 64 + Math.round(Math.sin(i / 2) * 6 + Math.random() * 4) }));

function Dashboard() {
  const { user, profile } = useHealthStore();

  const vitals = [
    { label: "Heart Rate", value: "72", unit: "bpm", icon: Heart, color: "text-emergency", bg: "bg-emergency/10" },
    { label: "SpO₂", value: "98", unit: "%", icon: Activity, color: "text-info", bg: "bg-info/10" },
    { label: "Steps", value: "8,420", unit: "today", icon: Flame, color: "text-warning", bg: "bg-warning/10" },
    { label: "Hydration", value: "1.8", unit: "L", icon: Droplet, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "there"} 👋`}
        description="Here's a snapshot of your health identity and live vitals."
        actions={
          <Link to="/sos">
            <Button variant="destructive" size="lg" className="shadow-emergency animate-pulse-emergency bg-emergency hover:bg-emergency/90">
              <Siren className="size-4" /> Emergency SOS
            </Button>
          </Link>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {vitals.map(({ label, value, unit, icon: Icon, color, bg }) => (
          <Card key={label} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`size-10 rounded-xl grid place-items-center ${bg} ${color}`}>
                  <Icon className="size-5" />
                </div>
                <Badge variant="secondary" className="text-[10px]"><TrendingUp className="size-3 mr-0.5" /> live</Badge>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs text-muted-foreground">{unit}</div>
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Heart className="size-4 text-emergency" /> Heart rate · last 24h</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-44">
              <ResponsiveContainer>
                <LineChart data={heartData}>
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="v" stroke="var(--emergency)" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl" />
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs opacity-80">Your Health ID</div>
                <div className="text-lg font-bold">{profile.fullName}</div>
                <div className="text-xs opacity-80">{profile.age} y/o · {profile.gender}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold">{profile.bloodGroup}</span>
            </div>
            <div className="mt-4 aspect-square max-w-[160px] mx-auto rounded-xl bg-white/95 grid place-items-center">
              <QrCode className="size-28 text-foreground" strokeWidth={1.2} />
            </div>
            <Link to="/qr-code">
              <Button variant="secondary" size="sm" className="w-full mt-4">
                Open full QR <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickLink to="/ai-insights" icon={Brain} title="AI Health Insights" desc="See your predicted risks & prevention tips." color="bg-info/10 text-info" />
        <QuickLink to="/wearables" icon={Watch} title="Connect a wearable" desc="Sync Apple Watch, Fitbit, Garmin & more." color="bg-warning/10 text-warning" />
        <QuickLink to="/hospitals" icon={Hospital} title="Hospital network" desc="See nearby connected hospitals." color="bg-success/10 text-success" />
        <QuickLink to="/records" icon={ShieldCheck} title="Medical records" desc="Prescriptions, lab reports & insurance." color="bg-primary/10 text-primary" />
        <QuickLink to="/analytics" icon={TrendingUp} title="Health analytics" desc="Trends & monthly reports." color="bg-emergency/10 text-emergency" />
        <QuickLink to="/profile" icon={Heart} title="Update profile" desc="Keep allergies & medications current." color="bg-accent text-accent-foreground" />
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, desc, color }: { to: string; icon: typeof Heart; title: string; desc: string; color: string }) {
  return (
    <Link to={to}>
      <Card className="hover:shadow-elegant transition-all hover:-translate-y-0.5 group h-full">
        <CardContent className="p-4 flex items-start gap-3">
          <div className={`size-10 rounded-xl grid place-items-center ${color}`}>
            <Icon className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{title}</div>
            <div className="text-xs text-muted-foreground">{desc}</div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:text-foreground transition-all" />
        </CardContent>
      </Card>
    </Link>
  );
}
