import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHealthStore, buildQrUrl } from "@/lib/health-store";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Share2, Printer, Copy, Lock, ShieldCheck, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/qr-code")({
  head: () => ({ meta: [{ title: "My QR Code — QR Health ID" }] }),
  component: QrPage,
});

function QrPage() {
  const { profile } = useHealthStore();
  const [url, setUrl] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setUrl(buildQrUrl(profile)); }, [profile]);

  const download = () => {
    const canvas = wrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-health-${profile.fullName.replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("QR downloaded");
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "My Health ID", url }); } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const copy = () => { navigator.clipboard.writeText(url); toast.success("Link copied"); };

  return (
    <div>
      <PageHeader
        title="My QR Health ID"
        description="Scan opens a fast, mobile-friendly emergency view of your critical info."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}><Printer className="size-4" /> Print</Button>
            <Button onClick={download}><Download className="size-4" /> Download</Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-[1fr,1.2fr] gap-4">
        <Card className="overflow-hidden">
          <div className="bg-gradient-primary text-primary-foreground p-5 flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80">SMART HEALTH ID</div>
              <div className="font-bold">{profile.fullName}</div>
              <div className="text-xs opacity-80">{profile.age} y/o · {profile.gender}</div>
            </div>
            <Badge className="bg-white/20 backdrop-blur text-primary-foreground border-transparent text-sm font-bold px-3 py-1">{profile.bloodGroup}</Badge>
          </div>
          <CardContent className="p-6 grid place-items-center">
            <div ref={wrapRef} className="p-4 rounded-2xl bg-white shadow-elegant-lg relative overflow-hidden">
              <div className="absolute inset-x-0 h-px bg-primary/60 animate-scan" />
              {url && <QRCodeCanvas value={url} size={240} level="H" includeMargin={false} fgColor="#0f172a" bgColor="#ffffff" />}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center max-w-xs">
              Anyone scanning this code with a phone camera will see your essential emergency information.
            </p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={copy}><Copy className="size-3.5" /> Copy link</Button>
              <Button variant="outline" size="sm" onClick={share}><Share2 className="size-3.5" /> Share</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">What's in your QR code</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
              <Info label="Blood group" value={profile.bloodGroup} />
              <Info label="Age" value={`${profile.age}`} />
              <Info label="Allergies" value={profile.allergies.join(", ") || "None"} />
              <Info label="Conditions" value={profile.conditions.join(", ") || "None"} />
              <Info label="Emergency contact" value={profile.emergencyContacts[0] ? `${profile.emergencyContacts[0].name} · ${profile.emergencyContacts[0].phone}` : "—"} />
              <Info label="Insurance" value={profile.insuranceProvider || "—"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lock className="size-4 text-primary" /> Privacy & access</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Tile icon={<ShieldCheck className="size-4 text-success" />} title="Public emergency view" desc="Only first-aid critical info: blood group, allergies, conditions, ICE contact." />
              <Tile icon={<Lock className="size-4 text-primary" />} title="Full record (gated)" desc="Hospitals must authenticate via the QR Health Network to access full records." />
              <Tile icon={<WifiOff className="size-4 text-info" />} title="Offline ready" desc="Critical info is cached locally, available even without internet." />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/40 rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-medium truncate">{value}</div>
    </div>
  );
}
function Tile({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
      <div className="mt-0.5">{icon}</div>
      <div><div className="font-medium">{title}</div><div className="text-xs text-muted-foreground">{desc}</div></div>
    </div>
  );
}
