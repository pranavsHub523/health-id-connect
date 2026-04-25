import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Languages, Volume2, WifiOff, Fingerprint, Database, Building2, ShieldCheck } from "lucide-react";
import { useHealthStore, saveProfile } from "@/lib/health-store";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — QR Health ID" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { profile } = useHealthStore();

  const update = <K extends keyof typeof profile>(k: K, v: (typeof profile)[K]) => {
    saveProfile({ ...profile, [k]: v });
    toast.success("Settings updated");
  };

  return (
    <div>
      <PageHeader title="Settings" description="Privacy, accessibility and integrations." />

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lock className="size-4 text-primary" /> Privacy & security</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Toggle label="Two-factor authentication" desc="Require an extra code at sign-in." defaultChecked />
            <Toggle label="Biometric unlock" desc="Use fingerprint or Face ID on supported devices." defaultChecked icon={<Fingerprint className="size-4 text-info" />} />
            <Toggle label="End-to-end encryption" desc="Records encrypted on-device before sync." defaultChecked icon={<ShieldCheck className="size-4 text-success" />} />
            <Toggle label="Blockchain audit log" desc="Tamper-proof access trail (beta)." icon={<Database className="size-4 text-warning" />} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Languages className="size-4 text-info" /> Accessibility</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm">App language</Label>
                <p className="text-xs text-muted-foreground">Localized UI for global users.</p>
              </div>
              <Select value={profile.language} onValueChange={(v) => update("language", v as typeof profile.language)}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिन्दी</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Toggle
              label="Voice assistance"
              desc="Read content aloud — helpful for elderly & visually impaired users."
              icon={<Volume2 className="size-4 text-primary" />}
              checked={profile.voiceAssistance}
              onChange={(v) => update("voiceAssistance", v)}
            />
            <Toggle label="Large text & high contrast" desc="Improve readability." />
            <Toggle label="Offline mode" desc="Cache critical info for offline access." defaultChecked icon={<WifiOff className="size-4 text-info" />} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building2 className="size-4 text-success" /> Government & smart city</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Toggle
              label="Link Aadhaar / national health ID"
              desc="Enables verified identity for hospitals & insurers."
              checked={!!profile.aadhaarLinked}
              onChange={(v) => update("aadhaarLinked", v)}
            />
            <Toggle label="Smart city integration" desc="Allow city emergency services to receive SOS alerts." defaultChecked />
            <Toggle
              label="Organ donor registration"
              desc="Marks you as a registered donor in your QR profile."
              checked={!!profile.organDonor}
              onChange={(v) => update("organDonor", v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Connected services</CardTitle></CardHeader>
          <CardContent className="space-y-2.5">
            <Service name="Red Cross Emergency Network" status="connected" />
            <Service name="National Ambulance API" status="connected" />
            <Service name="Apple Health" status="connected" />
            <Service name="Google Fit" status="not-connected" />
            <Service name="Insurance Portal — HealthShield+" status="connected" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Toggle({ label, desc, defaultChecked, checked, onChange, icon }: {
  label: string; desc?: string; defaultChecked?: boolean; checked?: boolean; onChange?: (v: boolean) => void; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex gap-3">
        {icon && <div className="mt-0.5">{icon}</div>}
        <div>
          <Label className="text-sm">{label}</Label>
          {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Service({ name, status }: { name: string; status: "connected" | "not-connected" }) {
  const ok = status === "connected";
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
      <div className="text-sm font-medium">{name}</div>
      <Badge className={ok ? "bg-success/15 text-success border-success/20" : "bg-muted text-muted-foreground"}>{ok ? "Connected" : "Connect"}</Badge>
    </div>
  );
}
