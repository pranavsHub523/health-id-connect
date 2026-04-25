import { createFileRoute, useParams } from "@tanstack/react-router";
import { parseQrPayload } from "@/lib/health-store";
import { HeartPulse, Phone, AlertTriangle, Stethoscope, ShieldAlert, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export const Route = createFileRoute("/emergency/$payload")({
  head: () => ({ meta: [{ title: "Emergency Health Info" }, { name: "robots", content: "noindex" }] }),
  component: EmergencyView,
});

function EmergencyView() {
  const { payload } = useParams({ from: "/emergency/$payload" });
  const data = useMemo(() => parseQrPayload(payload), [payload]);

  if (!data) {
    return (
      <div className="min-h-screen grid place-items-center bg-background p-6 text-center">
        <div>
          <ShieldAlert className="size-12 text-emergency mx-auto" />
          <h1 className="mt-3 text-2xl font-bold">Invalid QR data</h1>
          <p className="text-sm text-muted-foreground">This QR code could not be decoded.</p>
        </div>
      </div>
    );
  }

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const text = `Emergency information for ${data.fullName}, age ${data.age}. Blood group ${data.bloodGroup}. Allergies: ${(data.allergies || []).join(", ") || "none"}. Conditions: ${(data.conditions || []).join(", ") || "none"}.`;
    const u = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-emergency text-emergency-foreground p-5 sm:p-6 shadow-emergency">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="size-11 rounded-xl bg-white/20 backdrop-blur grid place-items-center"><HeartPulse className="size-6" /></div>
          <div>
            <div className="text-xs uppercase tracking-wider opacity-80">Emergency Health Info</div>
            <div className="font-bold text-lg">QR Health ID</div>
          </div>
          <Button variant="secondary" size="sm" className="ml-auto" onClick={speak}>
            <Volume2 className="size-4" /> Read
          </Button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 sm:p-6 space-y-4">
        <section className="bg-card border border-border rounded-2xl p-5 shadow-elegant">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">PATIENT</div>
              <h1 className="text-2xl font-bold">{data.fullName}</h1>
              <p className="text-sm text-muted-foreground">{data.age} years old</p>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-muted-foreground uppercase">Blood</div>
              <div className="text-2xl font-bold text-emergency px-3 py-1 rounded-lg bg-emergency/10">{data.bloodGroup}</div>
            </div>
          </div>
        </section>

        <Section icon={<AlertTriangle className="size-5 text-warning" />} title="Allergies" tone="warning">
          {(data.allergies?.length ?? 0) === 0 ? <p className="text-sm">None reported</p> : (
            <div className="flex flex-wrap gap-2">
              {data.allergies!.map((a) => <span key={a} className="px-3 py-1 rounded-full text-sm font-medium bg-warning/15 text-warning-foreground border border-warning/30">{a}</span>)}
            </div>
          )}
        </Section>

        <Section icon={<Stethoscope className="size-5 text-info" />} title="Medical conditions" tone="info">
          {(data.conditions?.length ?? 0) === 0 ? <p className="text-sm">None reported</p> : (
            <div className="flex flex-wrap gap-2">
              {data.conditions!.map((c) => <span key={c} className="px-3 py-1 rounded-full text-sm font-medium bg-info/15 text-info border border-info/30">{c}</span>)}
            </div>
          )}
        </Section>

        <Section icon={<Phone className="size-5 text-success" />} title="Emergency contacts" tone="success">
          <div className="space-y-2">
            {(data.emergencyContacts || []).map((c) => (
              <a key={c.id} href={`tel:${c.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 p-3 rounded-xl bg-success/10 border border-success/20 hover:bg-success/15 transition-colors">
                <div className="size-10 rounded-full bg-success text-success-foreground grid place-items-center font-bold">{c.name.slice(0, 1)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.relation}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">{c.phone}</div>
                  <div className="text-[10px] text-success font-bold">TAP TO CALL</div>
                </div>
              </a>
            ))}
          </div>
        </Section>

        <p className="text-xs text-center text-muted-foreground py-4">
          Public emergency view · Full medical record requires hospital authentication.
        </p>
      </main>
    </div>
  );
}

function Section({ icon, title, tone, children }: { icon: React.ReactNode; title: string; tone: "warning" | "info" | "success"; children: React.ReactNode }) {
  const border = tone === "warning" ? "border-l-warning" : tone === "info" ? "border-l-info" : "border-l-success";
  return (
    <section className={`bg-card border border-border border-l-4 ${border} rounded-2xl p-5 shadow-elegant`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
