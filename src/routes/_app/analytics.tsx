import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Download, TrendingDown, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Health Analytics — QR Health ID" }] }),
  component: AnalyticsPage,
});

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const bp = months.map((m, i) => ({ m, sys: 130 - Math.round(Math.sin(i / 2) * 6 + Math.random() * 4), dia: 85 - Math.round(Math.sin(i / 2) * 4 + Math.random() * 3) }));
const sugar = months.map((m, i) => ({ m, fasting: 95 + Math.round(Math.sin(i / 1.5) * 6 + Math.random() * 5) }));
const hr = months.map((m, i) => ({ m, hr: 72 + Math.round(Math.sin(i / 3) * 4 + Math.random() * 3) }));

function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Health Analytics"
        description="Trends across the year. Generate monthly reports to share with your doctor."
        actions={<Button variant="outline"><Download className="size-4" /> Download report</Button>}
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <KPI label="Avg. Blood Pressure" value="124 / 81" delta="-3.2%" trend="down" good />
        <KPI label="Avg. Heart Rate" value="74 bpm" delta="+1.4%" trend="up" />
        <KPI label="Avg. Fasting Sugar" value="98 mg/dL" delta="-2.1%" trend="down" good />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Blood pressure · 12 months</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={bp}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="sys" name="Systolic" stroke="var(--emergency)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="dia" name="Diastolic" stroke="var(--info)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Fasting blood sugar (mg/dL)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={sugar}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="fasting" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Resting heart rate</CardTitle></CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer>
                <LineChart data={hr}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="hr" stroke="var(--success)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPI({ label, value, delta, trend, good }: { label: string; value: string; delta: string; trend: "up" | "down"; good?: boolean }) {
  const Icon = trend === "up" ? TrendingUp : TrendingDown;
  const tone = good ? "bg-success/15 text-success border-success/20" : "bg-warning/15 text-warning-foreground border-warning/20";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 flex items-end justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <Badge variant="outline" className={`gap-1 ${tone}`}><Icon className="size-3" /> {delta}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
