import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Hospital, Search, MapPin, Phone, ShieldCheck, ScanLine } from "lucide-react";

export const Route = createFileRoute("/_app/hospitals")({
  head: () => ({ meta: [{ title: "Hospital Network — QR Health ID" }] }),
  component: HospitalsPage,
});

const hospitals = [
  { name: "City General Hospital", address: "MG Road, Bengaluru", distance: "1.2 km", phone: "+91 80 1234 5678", verified: true, specialty: "Multi-speciality" },
  { name: "Apollo Emergency", address: "Bannerghatta Rd, Bengaluru", distance: "3.5 km", phone: "+91 80 2345 6789", verified: true, specialty: "Cardiac" },
  { name: "Manipal Heart Centre", address: "Old Airport Rd, Bengaluru", distance: "5.0 km", phone: "+91 80 3456 7890", verified: true, specialty: "Cardiac" },
  { name: "Fortis Healthcare", address: "Cunningham Rd, Bengaluru", distance: "6.4 km", phone: "+91 80 4567 8901", verified: false, specialty: "Multi-speciality" },
];

const accessLog = [
  { who: "Dr. Meena Kapoor · City General", action: "Viewed full record", when: "2 days ago" },
  { who: "Apollo Emergency", action: "Updated medication list", when: "1 week ago" },
  { who: "Manipal Diagnostics", action: "Uploaded blood report", when: "3 weeks ago" },
];

function HospitalsPage() {
  return (
    <div>
      <PageHeader
        title="Hospital Network"
        description="Verified hospitals can scan your QR to view (and with consent, update) your records."
        actions={<Button variant="outline"><ScanLine className="size-4" /> Scan QR</Button>}
      />

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search hospitals, specialties, city..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-4">
        <div className="space-y-3">
          {hospitals.map((h) => (
            <Card key={h.name} className="hover:shadow-elegant transition-all">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="size-12 rounded-xl bg-success/10 text-success grid place-items-center shrink-0"><Hospital className="size-6" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold truncate">{h.name}</div>
                    {h.verified && <Badge variant="secondary" className="bg-success/15 text-success border-success/20 gap-1"><ShieldCheck className="size-3" /> verified</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {h.address} · {h.distance}</span>
                    <span className="flex items-center gap-1"><Phone className="size-3" /> {h.phone}</span>
                  </div>
                  <Badge variant="outline" className="mt-2 text-[10px]">{h.specialty}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Directions</Button>
                  <Button size="sm">Share record</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent access</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {accessLog.map((a, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40">
                <div className="size-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><ShieldCheck className="size-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.who}</div>
                  <div className="text-xs text-muted-foreground">{a.action}</div>
                </div>
                <div className="text-[10px] text-muted-foreground whitespace-nowrap">{a.when}</div>
              </div>
            ))}
            <Button variant="ghost" className="w-full">View full audit log</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
