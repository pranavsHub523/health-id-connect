import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Droplets, Activity, Sparkles, Lightbulb } from "lucide-react";
import { useHealthStore } from "@/lib/health-store";

export const Route = createFileRoute("/_app/ai-insights")({
  head: () => ({ meta: [{ title: "AI Health Insights — QR Health ID" }] }),
  component: AIPage,
});

function AIPage() {
  const { profile } = useHealthStore();
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);

  // Mock model output
  const risks = [
    { name: "Cardiovascular Disease", risk: 38, icon: Heart, color: "text-emergency", trend: "Moderate", note: "Hypertension + age elevate risk." },
    { name: "Type 2 Diabetes", risk: 22, icon: Droplets, color: "text-info", trend: "Low", note: "BMI in healthy range." },
    { name: "Hypertension flare", risk: 54, icon: Activity, color: "text-warning", trend: "Watch", note: "Recent BP readings trending up." },
    { name: "Stress / Burnout", risk: 31, icon: Brain, color: "text-primary", trend: "Low", note: "Sleep average 6.8h — improve to 7.5h." },
  ];

  const tips = [
    "Aim for 30 min of brisk walking, 5 days a week — proven to lower BP by ~5mmHg.",
    "Reduce sodium to under 2g/day. Watch processed snacks and sauces.",
    "Schedule a lipid profile every 6 months given your hypertension history.",
    "Add omega-3 (fatty fish or flaxseed) twice a week for cardiovascular support.",
  ];

  return (
    <div>
      <PageHeader
        title="AI Health Insights"
        description="Personalized risk predictions powered by your profile, vitals & wearables data."
        actions={<Badge variant="secondary" className="gap-1"><Sparkles className="size-3" /> ML model v2.4</Badge>}
      />

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-info/5 to-transparent border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
                <Brain className="size-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Your overall health score</h3>
                <p className="text-sm text-muted-foreground">Based on profile, lifestyle and recent vitals.</p>
              </div>
            </div>
            <div className="mt-6 flex items-end gap-3">
              <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">76</div>
              <div className="text-sm text-muted-foreground pb-2">/ 100 · "Good"</div>
            </div>
            <Progress value={76} className="mt-3 h-2" />
            <div className="grid grid-cols-3 gap-2 mt-5 text-center text-xs">
              <Stat label="Cardio" value="72" />
              <Stat label="Metabolic" value="81" />
              <Stat label="Mental" value="74" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Snapshot</CardTitle></CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            <Row label="BMI" value={bmi.toFixed(1)} />
            <Row label="Resting HR" value="72 bpm" />
            <Row label="Sleep avg" value="6.8 h" />
            <Row label="Steps avg" value="8,420 / day" />
            <Row label="Stress index" value="Moderate" />
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Predicted risks</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {risks.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.name}>
                  <div className="flex items-center gap-3">
                    <div className={`size-9 rounded-lg bg-muted grid place-items-center ${r.color}`}><Icon className="size-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{r.name}</div>
                        <Badge variant="outline" className="text-[10px]">{r.trend}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{r.note}</div>
                    </div>
                    <div className="text-sm font-bold tabular-nums w-10 text-right">{r.risk}%</div>
                  </div>
                  <Progress value={r.risk} className="h-1.5 mt-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="size-4 text-warning" /> Preventive suggestions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {tips.map((t, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40">
                <div className="size-7 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold shrink-0">{i + 1}</div>
                <p className="text-sm">{t}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="bg-card rounded-lg p-2.5 border border-border"><div className="text-lg font-bold">{value}</div><div className="text-[10px] uppercase text-muted-foreground">{label}</div></div>;
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
