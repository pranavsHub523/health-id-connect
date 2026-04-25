import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHealthStore } from "@/lib/health-store";
import { ShieldCheck, KeyRound } from "lucide-react";

export const Route = createFileRoute("/doctor/settings")({
  head: () => ({ meta: [{ title: "Verification — Clinician Portal" }] }),
  component: DoctorSettings,
});

function DoctorSettings() {
  const { user } = useHealthStore();
  return (
    <div>
      <PageHeader title="Verification & security" description="Your medical credentials and JWT session." />
      <div className="grid lg:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="size-4 text-success" /> License & affiliation</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Field label="Full name"><Input defaultValue={user?.name} /></Field>
            <Field label="License number"><Input defaultValue={user?.doctor?.licenseNumber} /></Field>
            <Field label="Hospital"><Input defaultValue={user?.doctor?.hospital} /></Field>
            <Field label="Specialty"><Input defaultValue={user?.doctor?.specialty} /></Field>
            <div className="flex justify-between items-center pt-2">
              <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/15"><ShieldCheck className="size-3" /> Verified</Badge>
              <Button variant="outline">Re-verify</Button>
            </div>
          </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><KeyRound className="size-4 text-primary" /> Active session</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><Label className="text-xs">JWT (mock)</Label><code className="block mt-1 p-2 rounded bg-muted text-[10px] break-all">{user?.token}</code></div>
            <p className="text-xs text-muted-foreground">Tokens are signed server-side and rotated every 7 days. Replace with real backend in production.</p>
          </CardContent></Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
