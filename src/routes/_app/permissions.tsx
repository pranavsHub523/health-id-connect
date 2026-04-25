import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHealthStore, decideRequest } from "@/lib/health-store";
import { Check, X, Clock, ShieldCheck, ShieldOff, Stethoscope, ClipboardList } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/permissions")({
  head: () => ({ meta: [{ title: "Access Permissions — QR Health ID" }] }),
  component: PermissionsPage,
});

function PermissionsPage() {
  const { requests, audit } = useHealthStore();
  const pending = requests.filter((r) => r.status === "pending");
  const active = requests.filter((r) => r.status === "approved" && (!r.expiresAt || new Date(r.expiresAt).getTime() > Date.now()));
  const past = requests.filter((r) => r.status === "denied" || r.status === "revoked" || (r.status === "approved" && r.expiresAt && new Date(r.expiresAt).getTime() <= Date.now()));

  return (
    <div>
      <PageHeader title="Access Permissions" description="Approve or revoke doctor access to your full medical record. You're always in control." />

      <Section title="Pending requests" icon={<Clock className="size-4 text-warning" />} count={pending.length}>
        {pending.length === 0 ? <Empty text="No pending requests." /> : pending.map((r) => (
          <Card key={r.id}><CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 text-primary grid place-items-center"><Stethoscope className="size-5" /></div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{r.doctorName}</div>
              <div className="text-xs text-muted-foreground">{r.specialty} · {r.hospital}</div>
              <div className="text-sm mt-1">"{r.reason}"</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { decideRequest(r.id, "denied"); toast.success("Request denied"); }}><X className="size-4" /> Deny</Button>
              <Button onClick={() => { decideRequest(r.id, "approved"); toast.success("Access granted for 24 hours"); }}><Check className="size-4" /> Approve</Button>
            </div>
          </CardContent></Card>
        ))}
      </Section>

      <Section title="Active access" icon={<ShieldCheck className="size-4 text-success" />} count={active.length}>
        {active.length === 0 ? <Empty text="No active grants." /> : active.map((r) => (
          <Card key={r.id}><CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-full bg-success/10 text-success grid place-items-center"><ShieldCheck className="size-5" /></div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{r.doctorName}</div>
              <div className="text-xs text-muted-foreground">{r.hospital} · expires {r.expiresAt ? new Date(r.expiresAt).toLocaleString() : "—"}</div>
            </div>
            <Button variant="outline" onClick={() => { decideRequest(r.id, "revoked"); toast.success("Access revoked"); }}><ShieldOff className="size-4" /> Revoke</Button>
          </CardContent></Card>
        ))}
      </Section>

      <Section title="History" icon={<ClipboardList className="size-4 text-muted-foreground" />} count={past.length}>
        {past.length === 0 ? <Empty text="No past requests." /> : past.map((r) => (
          <Card key={r.id}><CardContent className="p-4 flex items-center justify-between gap-3">
            <div><div className="font-medium">{r.doctorName}</div><div className="text-xs text-muted-foreground">{r.hospital}</div></div>
            <Badge variant="outline" className="capitalize">{r.status}</Badge>
          </CardContent></Card>
        ))}
      </Section>

      <Section title="Audit log" icon={<ClipboardList className="size-4 text-info" />} count={audit.length}>
        {audit.length === 0 ? <Empty text="No activity yet." /> : (
          <Card><CardContent className="p-0 divide-y divide-border">
            {audit.slice(0, 10).map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 text-sm">
                <div><div className="font-medium">{e.action}</div><div className="text-xs text-muted-foreground">{e.actor} · {e.detail || ""}</div></div>
                <div className="text-xs text-muted-foreground">{new Date(e.at).toLocaleString()}</div>
              </div>
            ))}
          </CardContent></Card>
        )}
      </Section>
    </div>
  );
}

function Section({ title, icon, count, children }: { title: string; icon: React.ReactNode; count: number; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-2">{icon}<h2 className="font-semibold">{title}</h2><Badge variant="outline" className="ml-1">{count}</Badge></div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
function Empty({ text }: { text: string }) { return <p className="text-sm text-muted-foreground py-2">{text}</p>; }
