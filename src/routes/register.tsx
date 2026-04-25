import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse } from "lucide-react";
import { login } from "@/lib/health-store";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — QR Health ID" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || password.length < 6) {
      toast.error("Fill all fields. Password must be at least 6 chars.");
      return;
    }
    login(email, name);
    toast.success("Account created. Let's set up your health profile.");
    navigate({ to: "/profile" });
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
          <h1 className="text-3xl font-bold leading-tight max-w-md">Your medical info, ready when seconds count.</h1>
          <p className="mt-4 opacity-80 max-w-md">Create your secure Health ID and generate your personal QR in minutes.</p>
        </div>
        <div className="relative text-sm opacity-70">Encrypted · Private · Yours</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold tracking-tight">Create account</h2>
          <p className="text-sm text-muted-foreground mt-1">Get your QR Health ID in under 2 minutes.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full shadow-elegant" size="lg">Create account</Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            Have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
