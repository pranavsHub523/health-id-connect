import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse } from "lucide-react";
import { login } from "@/lib/health-store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — QR Health ID" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("aarav@example.com");
  const [password, setPassword] = useState("demo1234");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      toast.error("Enter a valid email and a password of 6+ characters.");
      return;
    }
    login(email, "Aarav Sharma");
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
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
          <h1 className="text-3xl font-bold leading-tight max-w-md">"Within seconds, paramedics knew my blood group and allergies — that scan saved minutes that mattered."</h1>
          <p className="mt-4 opacity-80">— Real story from a Smart Health ID user</p>
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
          <p className="text-sm text-muted-foreground mt-1">Access your encrypted health identity.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <Button type="submit" className="w-full shadow-elegant" size="lg">Sign in</Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            New here? <Link to="/register" className="text-primary font-medium hover:underline">Create account</Link>
          </p>
          <p className="text-xs text-muted-foreground mt-4 text-center">Demo mode — any email works.</p>
        </div>
      </div>
    </div>
  );
}
