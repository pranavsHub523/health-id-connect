import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { useHealthStore, saveRecords, type MedicalRecord } from "@/lib/health-store";
import { FileText, FlaskConical, Image, Receipt, ShieldCheck, Plus, Search, Download, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/records")({
  head: () => ({ meta: [{ title: "Medical Records — QR Health ID" }] }),
  component: RecordsPage,
});

const typeMeta: Record<MedicalRecord["type"], { icon: typeof FileText; label: string; color: string }> = {
  prescription: { icon: FileText, label: "Prescription", color: "bg-primary/10 text-primary" },
  lab: { icon: FlaskConical, label: "Lab Report", color: "bg-info/10 text-info" },
  imaging: { icon: Image, label: "Imaging", color: "bg-warning/10 text-warning" },
  report: { icon: Receipt, label: "Report", color: "bg-success/10 text-success" },
  insurance: { icon: ShieldCheck, label: "Insurance", color: "bg-emergency/10 text-emergency" },
};

function RecordsPage() {
  const { records } = useHealthStore();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | MedicalRecord["type"]>("all");

  const filtered = records.filter((r) =>
    (tab === "all" || r.type === tab) &&
    (!q || r.title.toLowerCase().includes(q.toLowerCase()) || r.doctor?.toLowerCase().includes(q.toLowerCase()))
  );

  const remove = (id: string) => {
    saveRecords(records.filter((r) => r.id !== id));
    toast.success("Record removed");
  };
  const add = () => {
    const r: MedicalRecord = {
      id: "r" + Date.now(),
      title: "New Record",
      type: "report",
      date: new Date().toISOString().slice(0, 10),
      doctor: "—",
    };
    saveRecords([r, ...records]);
    toast.success("Record added");
  };

  return (
    <div>
      <PageHeader
        title="Medical Records"
        description="Prescriptions, lab reports, imaging and insurance documents — all in one place."
        actions={<Button onClick={add}><Plus className="size-4" /> Upload record</Button>}
      />

      <Card className="mb-4">
        <CardContent className="p-3 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by title or doctor..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="prescription">Rx</TabsTrigger>
              <TabsTrigger value="lab">Labs</TabsTrigger>
              <TabsTrigger value="imaging">Imaging</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Tabs value={tab}>
        <TabsContent value={tab} className="mt-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((r) => {
              const m = typeMeta[r.type];
              const Icon = m.icon;
              return (
                <Card key={r.id} className="hover:shadow-elegant transition-all group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className={`size-10 rounded-xl grid place-items-center ${m.color}`}><Icon className="size-5" /></div>
                      <Badge variant="outline" className="text-[10px]">{m.label}</Badge>
                    </div>
                    <div className="mt-3 font-semibold truncate">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.doctor || "—"} · {new Date(r.date).toLocaleDateString()}</div>
                    {r.notes && <div className="text-xs text-muted-foreground mt-2 line-clamp-2">{r.notes}</div>}
                    <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost"><Download className="size-3.5" /></Button>
                      <Button size="sm" variant="ghost"><Share2 className="size-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive ml-auto" onClick={() => remove(r.id)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filtered.length === 0 && (
              <Card className="sm:col-span-2 lg:col-span-3"><CardContent className="p-10 text-center text-sm text-muted-foreground">No records found.</CardContent></Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
