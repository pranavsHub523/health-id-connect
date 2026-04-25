import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export const Route = createFileRoute("/doctor/patients")({
  head: () => ({ meta: [{ title: "My Patients — Clinician Portal" }] }),
  component: PatientsList,
});

const seed = [
  { name: "Aarav Sharma", age: 32, blood: "O+", last: "Today", status: "Active access" },
  { name: "Riya Mehta", age: 28, blood: "A-", last: "Yesterday", status: "Emergency only" },
  { name: "Vikram Rao", age: 54, blood: "B+", last: "2 days ago", status: "Active access" },
  { name: "Anita Joseph", age: 41, blood: "AB+", last: "5 days ago", status: "Expired" },
];

function PatientsList() {
  return (
    <div>
      <PageHeader title="My Patients" description="Patients who have shared their Health ID with you." />
      <Card><CardContent className="p-0 divide-y divide-border">
        {seed.map((p) => (
          <div key={p.name} className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors">
            <div className="size-10 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center font-semibold">{p.name.slice(0,1)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{p.name} <span className="text-xs text-muted-foreground">· {p.age}y · {p.blood}</span></div>
              <div className="text-xs text-muted-foreground">Last accessed {p.last}</div>
            </div>
            <Badge variant="outline" className={p.status==="Active access"?"border-success/40 text-success":p.status==="Expired"?"border-muted-foreground/30 text-muted-foreground":"border-warning/40 text-warning"}>
              <Users className="size-3" /> {p.status}
            </Badge>
          </div>
        ))}
      </CardContent></Card>
    </div>
  );
}
