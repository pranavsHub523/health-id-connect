import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanLine, Camera, KeyRound, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { buildQrUrl, getProfile, parseQrPayload, appendAudit } from "@/lib/health-store";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/scan")({
  head: () => ({ meta: [{ title: "Scan Patient QR — Clinician Portal" }] }),
  component: ScanPage,
});

function ScanPage() {
  const navigate = useNavigate();
  const [manual, setManual] = useState("");
  const [scanning, setScanning] = useState(false);

  const decodeAndGo = (input: string) => {
    let payload = input.trim();
    const m = payload.match(/\/emergency\/([^/?#]+)/);
    if (m) payload = m[1];
    const data = parseQrPayload(payload);
    if (!data) { toast.error("Invalid QR payload."); return; }
    appendAudit({ actor: "Doctor", action: "Scanned patient QR", detail: data.fullName });
    navigate({ to: "/doctor/patient/$id", params: { id: payload } });
  };

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => { decodeAndGo(buildQrUrl(getProfile())); setScanning(false); }, 1200);
  };

  return (
    <div>
      <PageHeader title="Scan patient QR" description="Point your camera at a Smart Health QR or paste a payload." />
      <div className="grid lg:grid-cols-2 gap-4">
        <Card><CardContent className="p-6">
          <div className="aspect-square rounded-2xl bg-gradient-subtle border border-border grid place-items-center relative overflow-hidden">
            {scanning && <div className="absolute inset-x-0 h-px bg-primary animate-scan shadow-glow" />}
            <div className="text-center"><Camera className="size-14 text-muted-foreground mx-auto" /><p className="text-sm text-muted-foreground mt-3">Camera preview</p></div>
          </div>
          <Button className="w-full mt-4 shadow-elegant" onClick={simulateScan} disabled={scanning}>
            <ScanLine className="size-4" /> {scanning ? "Scanning…" : "Simulate scan (demo patient)"}
          </Button>
        </CardContent></Card>
        <div className="space-y-4">
          <Card><CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2"><KeyRound className="size-4 text-primary" /><h3 className="font-semibold">Manual entry</h3></div>
            <p className="text-sm text-muted-foreground mb-3">Paste a QR URL or payload string.</p>
            <div className="flex gap-2">
              <Input value={manual} onChange={(e) => setManual(e.target.value)} placeholder="https://.../emergency/..." />
              <Button onClick={() => manual && decodeAndGo(manual)}>Open</Button>
            </div>
          </CardContent></Card>
          <Card><CardContent className="p-5 flex gap-3">
            <div className="size-10 rounded-lg bg-warning/15 grid place-items-center shrink-0"><ShieldAlert className="size-5 text-warning" /></div>
            <div className="text-sm"><div className="font-semibold">RBAC reminder</div><p className="text-muted-foreground">Scanning shows only the public emergency view. To see full records you must request access — and the patient must approve.</p></div>
          </CardContent></Card>
        </div>
      </div>
    </div>
  );
}
