import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHealthStore } from "@/lib/health-store";
import { ClipboardList, Clock, Check, X } from "lucide-react";

export const Route = createFileRoute("/doctor/requests")({
  head: () => ({ meta: [{ title: "Access Requests — Clinician Portal" }] }),
  component: DoctorRequests,
});

function DoctorRequests() {
  const { user, requests } = useHealthStore();
  const mine = requests.filter((r) => r.doctorId === user?.id || r.doctorName === user?.name);
  return (
    <div>
      <PageHeader title="My access requests" description="Track patient consent for full record access." />
      {mine.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">
          <ClipboardList className="size-10 mx-auto mb-2 opacity-60" />No requests yet. Scan a patient QR to request access.
        </CardContent></Card>
      ) : (
        <div className="space-y-3">{mine.map((r) => (
          <Card key={r.id}><CardContent className="p-4 flex items-start justify-between gap-3">
            <div>
              <div className="font-medium">Patient #{r.patientId}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{r.reason}</div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="size-3" /> Requested {new Date(r.requestedAt).toLocaleString()}</div>
            </div>
            <StatusBadge status={r.status} />
          </CardContent></Card>
        ))}</div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    pending: { cls: "border-warning/40 text-warning", icon: <Clock className="size-3" /> },
    approved: { cls: "border-success/40 text-success", icon: <Check className="size-3" /> },
    denied: { cls: "border-destructive/40 text-destructive", icon: <X className="size-3" /> },
    revoked: { cls: "border-muted-foreground/30 text-muted-foreground", icon: <X className="size-3" /> },
  };
  const v = map[status] || map.pending;
  return <Badge variant="outline" className={v.cls}>{v.icon} {status}</Badge>;
}
