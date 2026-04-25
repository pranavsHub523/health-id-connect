import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHealthStore } from "@/lib/health-store";
import { ScanLine, Users, ClipboardList, ShieldCheck, Activity, FileText } from "lucide-react";

export const Route = createFileRoute("/_doctor/dashboard")({
  head: () => ({ meta: [{ title: "Clinician Dashboard — QR Health ID" }] }),
  component: DoctorDashboard,
});

function DoctorDashboard() {
  const { user, requests } = useHealthStore();
  const pending = requests.filter((r) => r.status === "pending").length;
  const approved = requests.filter((r) => r.status === "approved").length;

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name?.split(" ")[0] || "Doctor"}`}
        description="Scan a patient QR or manage your active access grants."
        actions={
          <Link to="/doctor/scan">
            <Button className="shadow-elegant"><ScanLine className="size-4" /> Scan patient QR</Button>
          </Link>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat icon={<Activity className="size-4 text-primary" />} label="Active patients" value="12" />
        <Stat icon={<ClipboardList className="size-4 text-info" />} label="Pending requests" value={String(pending)} />
        <Stat icon={<ShieldCheck className="size-4 text-success" />} label="Granted access" value={String(approved)} />
        <Stat icon={<FileText className="size-4 text-warning" />} label="Reports uploaded" value="38" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Verification status</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="License No." value={user?.doctor?.licenseNumber || "—"} />
            <Row label="Hospital" value={user?.doctor?.hospital || "—"} />
            <Row label="Specialty" value={user?.doctor?.specialty || "—"} />
            <div className="flex items-center justify-between pt-1">
              <span className="text-muted-foreground">Status</span>
              <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/15">
                <ShieldCheck className="size-3" /> Verified
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="size-4" /> Quick actions</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-2">
            <Link to="/doctor/scan"><Button variant="outline" className="w-full justify-start"><ScanLine className="size-4" /> Scan QR</Button></Link>
            <Link to="/doctor/requests"><Button variant="outline" className="w-full justify-start"><ClipboardList className="size-4" /> Requests</Button></Link>
            <Link to="/doctor/patients"><Button variant="outline" className="w-full justify-start"><Users className="size-4" /> My patients</Button></Link>
            <Link to="/doctor/settings"><Button variant="outline" className="w-full justify-start"><ShieldCheck className="size-4" /> Verification</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon} {label}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>
  );
}