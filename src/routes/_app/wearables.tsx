import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Watch, Heart, Footprints, MoonStar, Activity, Plus } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/wearables")({
  head: () => ({ meta: [{ title: "Wearables & IoT — QR Health ID" }] }),
  component: WearablesPage,
});

const sleepData = Array.from({ length: 7 }, (_, i) => ({ d: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], h: 6 + Math.random() * 2.5 }));
const stepsData = Array.from({ length: 7 }, (_, i) => ({ d: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], s: Math.round(5000 + Math.random() * 7000) }));

function WearablesPage() {
  const [devices, setDevices] = useState([
    { id: "d1", name: "Apple Watch Series 9", connected: true },
    { id: "d2", name: "Fitbit Charge 6", connected: false },
    { id: "d3", name: "Oura Ring Gen 3", connected: false },
    { id: "d4", name: "Garmin Forerunner 265", connected: false },
  ]);

  const toggle = (id: string) => {
    setDevices((ds) => ds.map((d) => d.id === id ? { ...d, connected: !d.connected } : d));
    const d = devices.find((x) => x.id === id);
    toast.success(`${d?.name} ${d?.connected ? "disconnected" : "connected"}`);
  };

  return (
    <div>
      <PageHeader
        title="Wearables & IoT"
        description="Sync your fitness wearables to feed live vitals into your Health ID."
        actions={<Button variant="outline"><Plus className="size-4" /> Add device</Button>}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <MetricCard icon={Heart} color="text-emergency" bg="bg-emergency/10" label="Heart rate" value="72" unit="bpm" />
        <MetricCard icon={Activity} color="text-info" bg="bg-info/10" label="SpO₂" value="98" unit="%" />
        <MetricCard icon={Footprints} color="text-warning" bg="bg-warning/10" label="Steps today" value="8,420" unit="" />
        <MetricCard icon={MoonStar} color="text-primary" bg="bg-primary/10" label="Sleep last night" value="7.2" unit="h" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Steps · last 7 days</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer>
                <AreaChart data={stepsData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--warning)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--warning)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="s" stroke="var(--warning)" fill="url(#g1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Sleep · last 7 days</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer>
                <AreaChart data={sleepData}>
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="h" stroke="var(--primary)" fill="url(#g2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Connected devices</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {devices.map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
              <div className="size-10 rounded-xl bg-card border border-border grid place-items-center"><Watch className="size-5 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{d.name}</div>
                <div className="text-xs text-muted-foreground">{d.connected ? "Syncing — last update 2 min ago" : "Not connected"}</div>
              </div>
              {d.connected && <Badge variant="secondary" className="bg-success/15 text-success border-success/20">Active</Badge>}
              <Switch checked={d.connected} onCheckedChange={() => toggle(d.id)} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ icon: Icon, color, bg, label, value, unit }: { icon: typeof Heart; color: string; bg: string; label: string; value: string; unit: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className={`size-10 rounded-xl grid place-items-center ${bg} ${color} mb-3`}><Icon className="size-5" /></div>
        <div className="flex items-baseline gap-1">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{unit}</div>
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
