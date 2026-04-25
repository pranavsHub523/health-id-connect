import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeartPulse, Stethoscope, User as UserIcon, ShieldCheck } from "lucide-react";
import { login } from "@/lib/health-store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — QR Health ID" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"patient" | "doctor">("patient");

  // Patient
  const [pEmail, setPEmail] = useState("aarav@example.com");
  const [pPassword, setPPassword] = useState("demo1234");

  // Doctor
  const [dEmail, setDEmail] = useState("dr.verma@hospital.com");
  const [dPassword, setDPassword] = useState("demo1234");
  const [dLicense, setDLicense] = useState("MH-2018-44781");
  const [dHospital, setDHospital] = useState("Apollo Hospital");

  const onPatient = (e: FormEvent) => {
    e.preventDefault();
    if (!pEmail.includes("@") || pPassword.length < 6) {
      toast.error("Enter a valid email and a password of 6+ characters.");
      return;
    }
    login({ email: pEmail, name: "Aarav Sharma", role: "patient" });
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const onDoctor = (e: FormEvent) => {
    e.preventDefault();
    if (!dEmail.includes("@") || dPassword.length < 6 || !dLicense.trim() || !dHospital.trim()) {
      toast.error("Fill all fields including license & hospital.");
      return;
    }
    login({
      email: dEmail,
      name: dEmail.split("@")[0].replace(/[^a-z]/gi, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      role: "doctor",
      doctor: { licenseNumber: dLicense, hospital: dHospital, specialty: "General Medicine", verified: true },
    });
    toast.success("Doctor verified — license confirmed.");
    navigate({ to: "/doctor/dashboard" });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white, transparent 40%)" }} />
        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
            <HeartPulse className="size-5" />
          </div>
          <span className="font-bold">QR Health ID</span>
        </Link>
        <div className="relative">
          <h1 className="text-3xl font-bold leading-tight max-w-md">Two roles. One platform built around consent.</h1>
          <p className="mt-4 opacity-80 max-w-md">Patients own their data. Doctors must request access — every action is signed and audited.</p>
          <div className="mt-6 flex items-center gap-2 text-xs opacity-90">
            <ShieldCheck className="size-4" /> JWT-secured · Role-based access control
          </div>
        </div>
        <div className="relative text-sm opacity-70">© {new Date().getFullYear()} QR Health ID</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center">
                <HeartPulse className="size-5 text-primary-foreground" />
              </div>
              <span className="font-bold">QR Health ID</span>
            </Link>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose your role to continue.</p>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "patient" | "doctor")} className="mt-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="patient"><UserIcon className="size-4" /> Patient</TabsTrigger>
              <TabsTrigger value="doctor"><Stethoscope className="size-4" /> Doctor</TabsTrigger>
            </TabsList>

            <TabsContent value="patient">
              <form onSubmit={onPatient} className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pemail">Email</Label>
                  <Input id="pemail" type="email" value={pEmail} onChange={(e) => setPEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ppwd">Password</Label>
                  <Input id="ppwd" type="password" value={pPassword} onChange={(e) => setPPassword(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" className="w-full shadow-elegant" size="lg">Sign in as Patient</Button>
              </form>
            </TabsContent>

            <TabsContent value="doctor">
              <form onSubmit={onDoctor} className="mt-4 space-y-4">
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
                    <Input id="dlic" value={dLicense} onChange={(e) => setDLicense(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dhos">Hospital ID</Label>
                    <Input id="dhos" value={dHospital} onChange={(e) => setDHospital(e.target.value)} required />
                  </div>
                </div>
                <Button type="submit" className="w-full shadow-elegant" size="lg">Sign in as Doctor</Button>
                <p className="text-[11px] text-muted-foreground text-center">License & hospital ID verified against medical registry (mock).</p>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            New here? <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}