import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeartPulse, Stethoscope, User as UserIcon, BadgeCheck } from "lucide-react";
import { login } from "@/lib/health-store";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — QR Health ID" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"patient" | "doctor">("patient");

  // Patient
  const [pName, setPName] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [pPassword, setPPassword] = useState("");

  // Doctor
  const [dName, setDName] = useState("");
  const [dEmail, setDEmail] = useState("");
  const [dPassword, setDPassword] = useState("");
  const [dLicense, setDLicense] = useState("");
  const [dHospital, setDHospital] = useState("");
  const [dSpecialty, setDSpecialty] = useState("General Medicine");

  const onPatient = (e: FormEvent) => {
    e.preventDefault();
    if (!pName.trim() || !pEmail.includes("@") || pPassword.length < 6) {
      toast.error("Fill all fields. Password must be at least 6 chars.");
      return;
    }
    login({ email: pEmail, name: pName, role: "patient" });
    toast.success("Account created. Let's set up your health profile.");
    navigate({ to: "/profile" });
  };

  const onDoctor = (e: FormEvent) => {
    e.preventDefault();
    if (!dName.trim() || !dEmail.includes("@") || dPassword.length < 6 || !dLicense.trim() || !dHospital.trim()) {
      toast.error("All fields are required, including license & hospital.");
      return;
    }
    if (dLicense.length < 6) {
      toast.error("License number looks invalid.");
      return;
    }
    login({
      email: dEmail,
      name: dName,
      role: "doctor",
      doctor: { licenseNumber: dLicense, hospital: dHospital, specialty: dSpecialty, verified: true },
    });
    toast.success("Doctor account created — license verified.");
    navigate({ to: "/doctor/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white, transparent 40%)" }} />
        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
            <HeartPulse className="size-5" />
          </div>
          <span className="font-bold">QR Health ID</span>
        </Link>
        <div className="relative">
          <h1 className="text-3xl font-bold leading-tight max-w-md">Join the consent-driven healthcare network.</h1>
          <p className="mt-4 opacity-80 max-w-md">Patients control what's shared. Doctors are verified and only see records you approve.</p>
          <div className="mt-6 flex items-center gap-2 text-xs opacity-90">
            <BadgeCheck className="size-4" /> Verified doctors · Encrypted records · Audit trail
          </div>
        </div>
        <div className="relative text-sm opacity-70">Encrypted · Private · Yours</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold tracking-tight">Create account</h2>
          <p className="text-sm text-muted-foreground mt-1">Pick the role that fits you.</p>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "patient" | "doctor")} className="mt-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="patient"><UserIcon className="size-4" /> Patient</TabsTrigger>
              <TabsTrigger value="doctor"><Stethoscope className="size-4" /> Doctor</TabsTrigger>
            </TabsList>

            <TabsContent value="patient">
              <form onSubmit={onPatient} className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pname">Full name</Label>
                  <Input id="pname" value={pName} onChange={(e) => setPName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pemail">Email</Label>
                  <Input id="pemail" type="email" value={pEmail} onChange={(e) => setPEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ppwd">Password</Label>
                  <Input id="ppwd" type="password" value={pPassword} onChange={(e) => setPPassword(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" className="w-full shadow-elegant" size="lg">Create patient account</Button>
              </form>
            </TabsContent>

            <TabsContent value="doctor">
              <form onSubmit={onDoctor} className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="dname">Full name</Label>
                  <Input id="dname" value={dName} onChange={(e) => setDName(e.target.value)} required placeholder="Dr. ..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="demail">Work email</Label>
                  <Input id="demail" type="email" value={dEmail} onChange={(e) => setDEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dpwd">Password</Label>
                  <Input id="dpwd" type="password" value={dPassword} onChange={(e) => setDPassword(e.target.value)} required minLength={6} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="dlic">License No.</Label>
                    <Input id="dlic" value={dLicense} onChange={(e) => setDLicense(e.target.value)} required placeholder="MH-2018-XXXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dhos">Hospital</Label>
                    <Input id="dhos" value={dHospital} onChange={(e) => setDHospital(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dspec">Specialty</Label>
                  <Input id="dspec" value={dSpecialty} onChange={(e) => setDSpecialty(e.target.value)} />
                </div>
                <Button type="submit" className="w-full shadow-elegant" size="lg">Create doctor account</Button>
                <p className="text-[11px] text-muted-foreground text-center">License is verified against the medical registry before activation (mock).</p>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}