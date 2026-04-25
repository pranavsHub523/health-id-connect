import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Siren, MapPin, PhoneCall, Hospital, Ambulance, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useHealthStore } from "@/lib/health-store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/sos")({
  head: () => ({ meta: [{ title: "Emergency SOS — QR Health ID" }] }),
  component: SOSPage,
});

const responders = [
  { name: "City General Hospital", distance: "1.2 km", eta: "4 min", type: "hospital" },
  { name: "Red Cross Ambulance", distance: "2.1 km", eta: "6 min", type: "ambulance" },
  { name: "Apollo Emergency", distance: "3.5 km", eta: "9 min", type: "hospital" },
];

function SOSPage() {
  const { profile } = useHealthStore();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const trigger = () => {
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      toast.success("Emergency alert dispatched to nearby responders.");
    }, 1800);
  };

  return (
    <div>
      <PageHeader title="Emergency SOS" description="Instantly broadcast your location and critical health data to nearby responders." />

      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-4">
        <Card className="overflow-hidden border-emergency/30">
          <CardContent className="p-6 sm:p-10 text-center bg-gradient-to-b from-emergency/5 to-transparent">
            {status === "idle" && (
              <>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Press and hold for 2 seconds in a real emergency. Your location and emergency profile will be shared with the nearest hospital, ambulance and your emergency contacts.
                </p>
                <button
                  onClick={trigger}
                  className="mt-8 mx-auto size-48 rounded-full bg-gradient-emergency text-emergency-foreground grid place-items-center shadow-emergency animate-pulse-emergency hover:scale-105 transition-transform"
                  aria-label="Trigger SOS"
                >
                  <div>
                    <Siren className="size-16 mx-auto" />
                    <div className="text-xl font-bold mt-2">SOS</div>
                  </div>
                </button>
                <p className="mt-6 text-xs text-muted-foreground">For demonstration only — does not contact real emergency services.</p>
              </>
            )}

            {status === "sending" && (
              <div className="py-12">
                <Loader2 className="size-16 mx-auto text-emergency animate-spin" />
                <h3 className="mt-6 text-xl font-bold">Dispatching alert...</h3>
                <p className="text-sm text-muted-foreground">Notifying nearby hospitals & emergency contacts.</p>
              </div>
            )}

            {status === "sent" && (
              <div className="py-8">
                <div className="size-20 mx-auto rounded-full bg-success/15 grid place-items-center">
                  <CheckCircle2 className="size-10 text-success" />
                </div>
                <h3 className="mt-5 text-xl font-bold">Help is on the way</h3>
                <p className="text-sm text-muted-foreground mt-1">3 responders received your alert.</p>
                <div className="mt-6 grid sm:grid-cols-3 gap-2 max-w-md mx-auto text-left">
                  {responders.map((r) => (
                    <div key={r.name} className="p-3 rounded-lg bg-muted/40 text-xs">
                      <div className="font-semibold truncate">{r.name}</div>
                      <div className="text-muted-foreground">ETA {r.eta}</div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>Reset demo</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="size-4 text-info" /> Live location sharing</CardTitle></CardHeader>
            <CardContent>
              <div className="aspect-video rounded-xl bg-gradient-to-br from-info/10 to-primary/10 border border-border relative overflow-hidden grid place-items-center">
                <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, transparent 0, transparent 30%, var(--border) 30.5%, transparent 31%), radial-gradient(circle at 50% 50%, transparent 0, transparent 50%, var(--border) 50.5%, transparent 51%)" }} />
                <div className="relative">
                  <div className="size-4 rounded-full bg-emergency animate-pulse-emergency" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Approx: MG Road, Bengaluru · 12.971°N, 77.594°E</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Hospital className="size-4 text-success" /> Nearby responders</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {responders.map((r) => (
                <div key={r.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40">
                  <div className={`size-9 rounded-lg grid place-items-center ${r.type === "ambulance" ? "bg-emergency/15 text-emergency" : "bg-success/15 text-success"}`}>
                    {r.type === "ambulance" ? <Ambulance className="size-4" /> : <Hospital className="size-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.distance} · ETA {r.eta}</div>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">connected</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><PhoneCall className="size-4 text-primary" /> Emergency contacts</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {profile.emergencyContacts.map((c) => (
                <a key={c.id} href={`tel:${c.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-muted transition-colors">
                  <div className="size-9 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center font-semibold text-sm">{c.name.slice(0, 1)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{c.relation} · {c.phone}</div>
                  </div>
                  <PhoneCall className="size-4 text-primary" />
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
