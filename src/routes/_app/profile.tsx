import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { getProfile, saveProfile, type EmergencyContact, type HealthProfile, type Medication } from "@/lib/health-store";
import { Plus, Trash2, Save, X, AlertTriangle, Heart, Pill, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Health Profile — QR Health ID" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [p, setP] = useState<HealthProfile>(() => getProfile());
  const [allergyInput, setAllergyInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");

  const update = <K extends keyof HealthProfile>(k: K, v: HealthProfile[K]) => setP((x) => ({ ...x, [k]: v }));

  const save = () => {
    saveProfile(p);
    toast.success("Profile saved & encrypted.");
  };

  return (
    <div>
      <PageHeader
        title="Health Profile"
        description="Information shared via your QR code in emergencies. Keep it accurate."
        actions={
          <Button onClick={save} className="shadow-elegant"><Save className="size-4" /> Save changes</Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name"><Input value={p.fullName} onChange={(e) => update("fullName", e.target.value)} /></Field>
            <Field label="Age"><Input type="number" value={p.age} onChange={(e) => update("age", Number(e.target.value))} /></Field>
            <Field label="Gender">
              <Select value={p.gender} onValueChange={(v) => update("gender", v as HealthProfile["gender"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Blood group">
              <Select value={p.bloodGroup} onValueChange={(v) => update("bloodGroup", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Height (cm)"><Input type="number" value={p.height} onChange={(e) => update("height", Number(e.target.value))} /></Field>
            <Field label="Weight (kg)"><Input type="number" value={p.weight} onChange={(e) => update("weight", Number(e.target.value))} /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Heart className="size-4 text-emergency" /> Vitals snapshot</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="BMI" value={(p.weight / Math.pow(p.height / 100, 2)).toFixed(1)} />
            <Row label="Blood group" value={p.bloodGroup} />
            <Row label="Allergies" value={p.allergies.length.toString()} />
            <Row label="Conditions" value={p.conditions.length.toString()} />
            <Row label="Medications" value={p.medications.length.toString()} />
            <Row label="Emergency contacts" value={p.emergencyContacts.length.toString()} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="size-4 text-warning" /> Allergies & Conditions</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <ChipEditor
              label="Allergies"
              items={p.allergies}
              input={allergyInput}
              setInput={setAllergyInput}
              onAdd={() => { if (allergyInput.trim()) { update("allergies", [...p.allergies, allergyInput.trim()]); setAllergyInput(""); } }}
              onRemove={(i) => update("allergies", p.allergies.filter((_, idx) => idx !== i))}
              tone="warning"
            />
            <ChipEditor
              label="Medical conditions"
              items={p.conditions}
              input={conditionInput}
              setInput={setConditionInput}
              onAdd={() => { if (conditionInput.trim()) { update("conditions", [...p.conditions, conditionInput.trim()]); setConditionInput(""); } }}
              onRemove={(i) => update("conditions", p.conditions.filter((_, idx) => idx !== i))}
              tone="info"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Pill className="size-4 text-primary" /> Insurance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Provider"><Input value={p.insuranceProvider || ""} onChange={(e) => update("insuranceProvider", e.target.value)} /></Field>
            <Field label="Policy number"><Input value={p.insuranceNumber || ""} onChange={(e) => update("insuranceNumber", e.target.value)} /></Field>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Pill className="size-4 text-primary" /> Medications</CardTitle>
            <Button size="sm" variant="outline" onClick={() => update("medications", [...p.medications, { id: "m" + Date.now(), name: "", dosage: "", frequency: "" }])}>
              <Plus className="size-4" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {p.medications.length === 0 && <p className="text-sm text-muted-foreground">No medications added.</p>}
            {p.medications.map((m, i) => (
              <div key={m.id} className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,1fr,auto] gap-2 items-end p-3 rounded-lg bg-muted/40">
                <Field label="Name"><Input value={m.name} onChange={(e) => update("medications", p.medications.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} /></Field>
                <Field label="Dosage"><Input value={m.dosage} onChange={(e) => update("medications", p.medications.map((x, idx) => idx === i ? { ...x, dosage: e.target.value } : x))} /></Field>
                <Field label="Frequency"><Input value={m.frequency} onChange={(e) => update("medications", p.medications.map((x, idx) => idx === i ? { ...x, frequency: e.target.value } : x))} /></Field>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => update("medications", p.medications.filter((_, idx) => idx !== i))}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Phone className="size-4 text-success" /> Emergency Contacts</CardTitle>
            <Button size="sm" variant="outline" onClick={() => update("emergencyContacts", [...p.emergencyContacts, { id: "e" + Date.now(), name: "", relation: "", phone: "" }])}>
              <Plus className="size-4" /> Add contact
            </Button>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {p.emergencyContacts.map((c, i) => (
              <ContactCard key={c.id} c={c}
                onChange={(nc) => update("emergencyContacts", p.emergencyContacts.map((x, idx) => idx === i ? nc : x))}
                onRemove={() => update("emergencyContacts", p.emergencyContacts.filter((_, idx) => idx !== i))}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium">{value}</span></div>;
}
function ChipEditor({ label, items, input, setInput, onAdd, onRemove, tone }: {
  label: string; items: string[]; input: string; setInput: (s: string) => void; onAdd: () => void; onRemove: (i: number) => void;
  tone: "warning" | "info";
}) {
  const cls = tone === "warning" ? "bg-warning/15 text-warning-foreground border-warning/30" : "bg-info/15 text-info border-info/30";
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
        {items.map((it, i) => (
          <Badge key={it + i} className={`gap-1 ${cls} hover:opacity-90`}>
            {it} <button onClick={() => onRemove(i)} aria-label="remove"><X className="size-3" /></button>
          </Badge>
        ))}
        {items.length === 0 && <span className="text-xs text-muted-foreground">None added.</span>}
      </div>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Add ${label.toLowerCase()}...`} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }} />
        <Button onClick={onAdd} variant="outline"><Plus className="size-4" /></Button>
      </div>
    </div>
  );
}
function ContactCard({ c, onChange, onRemove }: { c: EmergencyContact; onChange: (c: EmergencyContact) => void; onRemove: () => void }) {
  return (
    <div className="p-3 rounded-lg bg-muted/40 space-y-2">
      <div className="flex items-center justify-between">
        <div className="size-8 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-xs font-bold">{(c.name || "?").slice(0, 1).toUpperCase()}</div>
        <Button size="icon" variant="ghost" className="text-destructive size-7" onClick={onRemove}><Trash2 className="size-3.5" /></Button>
      </div>
      <Input placeholder="Name" value={c.name} onChange={(e) => onChange({ ...c, name: e.target.value })} />
      <Input placeholder="Relation" value={c.relation} onChange={(e) => onChange({ ...c, relation: e.target.value })} />
      <Input placeholder="Phone" value={c.phone} onChange={(e) => onChange({ ...c, phone: e.target.value })} />
    </div>
  );
}

// Re-export type to keep TS happy
export type { Medication };
