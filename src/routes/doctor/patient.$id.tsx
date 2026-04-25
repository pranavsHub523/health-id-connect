import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseQrPayload, useHealthStore, createRequest, hasActiveAccess, getRecords, saveRecords, appendAudit, type MedicalRecord } from "@/lib/health-store";
import { useMemo, useState } from "react";
import { AlertTriangle, Phone, Stethoscope, Lock, FileUp, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/patient/$id")({
  head: () => ({ meta: [{ title: "Patient — Clinician Portal" }] }),
  component: PatientView,
});

function PatientView() {
  const { id } = useParams({ from: "/doctor/patient/$id" });
  const { user, requests, records } = useHealthStore();
  const data = useMemo(() => parseQrPayload(id), [id]);
  const access = user ? hasActiveAccess(user.id) : false;
  const [reason, setReason] = useState("Routine consultation follow-up");
  const myPending = requests.find((r) => r.doctorId === user?.id && r.status === "pending");

  if (!data) {
    return <div className="text-center py-20"><h2 className="text-xl font-semibold">Invalid QR data</h2><Link to="/doctor/scan" className="text-primary hover:underline">Back to scan</Link></div>;
  }

  const requestAccess = () => {
    if (!user) return;
    createRequest({ doctorId: user.id, doctorName: user.name, hospital: user.doctor?.hospital || "—", specialty: user.doctor?.specialty || "—", patientId: "self", reason });
    toast.success("Access request sent to patient.");
  };

  return (
    <div>
      <Link to="/doctor/scan" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"><ArrowLeft className="size-4" /> Back to scan</Link>
      <PageHeader title={data.fullName || "Patient"} description={`${data.age ?? "—"} years · Blood ${data.bloodGroup ?? "—"}`}
        actions={access ? <Badge className="bg-success/15 text-success border-success/30"><ShieldCheck className="size-3" /> Full access granted</Badge> : <Badge variant="outline" className="border-warning/40 text-warning"><Lock className="size-3" /> Emergency view only</Badge>} />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="size-4 text-warning" /> Emergency Info (public)</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
              <Info label="Allergies" value={(data.allergies || []).join(", ") || "None"} />
              <Info label="Conditions" value={(data.conditions || []).join(", ") || "None"} />
              <Info label="Blood group" value={data.bloodGroup || "—"} />
              <Info label="Age" value={String(data.age ?? "—")} />
            </CardContent></Card>
          <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Phone className="size-4 text-success" /> Emergency contacts</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {(data.emergencyContacts || []).map((c) => (
                <a key={c.id} href={`tel:${c.phone.replace(/\s/g, "")}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted">
                  <div><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.relation}</div></div>
                  <div className="font-mono text-sm">{c.phone}</div>
                </a>
              ))}
            </CardContent></Card>
          {access ? <FullRecord /> : (
            <Card className="border-warning/30"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Lock className="size-4 text-warning" /> Full medical record (gated)</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">You currently have emergency-only access. Request explicit consent to view prescriptions, labs and history.</p>
                <div className="space-y-2"><Label htmlFor="reason" className="text-xs">Reason for access</Label><Textarea id="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} /></div>
                {myPending ? <Badge variant="outline" className="border-info/40 text-info">Request pending patient approval</Badge> : <Button onClick={requestAccess}><Stethoscope className="size-4" /> Request full access</Button>}
              </CardContent></Card>
          )}
        </div>
        <aside className="space-y-4">
          <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><FileUp className="size-4 text-primary" /> Upload report</CardTitle></CardHeader>
            <CardContent>{access ? <UploadReport /> : <p className="text-sm text-muted-foreground">Approval required before uploading.</p>}</CardContent></Card>
          {access && <Card><CardHeader><CardTitle className="text-base">Recent records</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {records.slice(0, 4).map((r) => (
                <div key={r.id} className="p-2 rounded bg-muted/40"><div className="font-medium">{r.title}</div><div className="text-xs text-muted-foreground">{r.type} · {r.date}</div></div>
              ))}
            </CardContent></Card>}
        </aside>
      </div>
    </div>
  );
}

function FullRecord() {
  const { records } = useHealthStore();
  return (
    <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="size-4 text-success" /> Full medical record</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {records.map((r) => (
          <div key={r.id} className="p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between"><div className="font-semibold">{r.title}</div><Badge variant="outline" className="capitalize">{r.type}</Badge></div>
            <div className="text-xs text-muted-foreground mt-1">{r.date} · {r.doctor || "—"}</div>
            {r.notes && <div className="text-sm mt-2">{r.notes}</div>}
          </div>
        ))}
      </CardContent></Card>
  );
}

function UploadReport() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<MedicalRecord["type"]>("prescription");
  const [notes, setNotes] = useState("");
  const upload = () => {
    if (!title.trim()) { toast.error("Add a title."); return; }
    const rec: MedicalRecord = { id: "r_" + Math.random().toString(36).slice(2, 8), title, type, date: new Date().toISOString().slice(0, 10), doctor: "Dr. (you)", notes };
    saveRecords([rec, ...getRecords()]);
    appendAudit({ actor: "Doctor", action: "Uploaded record", detail: title });
    toast.success("Record added to patient timeline.");
    setTitle(""); setNotes("");
  };
  return (
    <div className="space-y-3">
      <Input placeholder="Report title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Select value={type} onValueChange={(v) => setType(v as MedicalRecord["type"])}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{(["prescription","lab","imaging","report","insurance"] as const).map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
      </Select>
      <Textarea rows={3} placeholder="Notes / findings" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Button className="w-full" onClick={upload}><FileUp className="size-4" /> Upload</Button>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="bg-muted/40 rounded-lg p-3"><div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div><div className="font-medium truncate">{value}</div></div>;
}
