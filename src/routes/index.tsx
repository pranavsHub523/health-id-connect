import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  HeartPulse,
  QrCode,
  Shield,
  Siren,
  Brain,
  Watch,
  Hospital,
  Languages,
  WifiOff,
  ArrowRight,
  CheckCircle2,
  Activity,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart QR Health ID — Life-Saving Health Identity" },
      {
        name: "description",
        content:
          "One scannable QR code that gives first responders instant access to your blood group, allergies, conditions, medications and emergency contacts.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: QrCode, title: "Personal Health QR", desc: "A unique QR linked to your encrypted profile, shareable in seconds." },
  { icon: Siren, title: "Emergency SOS", desc: "One tap shares your live location and vitals with nearby hospitals." },
  { icon: Brain, title: "AI Health Insights", desc: "Risk predictions for heart disease, diabetes and more." },
  { icon: Watch, title: "Wearables & IoT", desc: "Sync Apple Watch, Fitbit & other devices for real-time vitals." },
  { icon: Hospital, title: "Hospital Network", desc: "Hospitals scan & update your records — fully consent-based." },
  { icon: WifiOff, title: "Offline Mode", desc: "Critical info available even without an internet connection." },
  { icon: Languages, title: "Accessibility", desc: "Voice assistance & multi-language for everyone." },
  { icon: Shield, title: "Privacy First", desc: "End-to-end encryption with optional blockchain-backed audit log." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <HeartPulse className="size-5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">QR Health ID</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="shadow-elegant">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-[0.07] pointer-events-none" />
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-info/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5">
              <Activity className="size-3.5" />
              Next-gen Healthcare Identity
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Your life-saving <span className="bg-gradient-primary bg-clip-text text-transparent">health identity</span> in one scan.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Smart QR Health ID gives paramedics, hospitals and loved ones instant access to the medical
              information that matters most — securely, privately, and even offline.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" className="shadow-glow">
                  Create your Health ID <ArrowRight className="ml-1 size-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  I already have an account
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["Encrypted", "Offline-ready", "Multi-language", "Free for individuals"].map((b) => (
                <div key={b} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-success" /> {b}
                </div>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-primary opacity-30 blur-3xl rounded-3xl" />
            <div className="relative bg-card border border-border rounded-3xl p-6 shadow-elegant-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">EMERGENCY ID</div>
                  <div className="font-semibold">Aarav Sharma · 32</div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emergency/10 text-emergency text-xs font-bold">
                  O+ BLOOD
                </span>
              </div>
              <div className="aspect-square rounded-2xl bg-gradient-subtle border border-border grid place-items-center p-6 relative overflow-hidden">
                <div className="absolute inset-x-0 h-px bg-primary/60 animate-scan shadow-glow" />
                <QrCode className="size-40 text-foreground" strokeWidth={1.2} />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <Stat label="Allergies" value="Penicillin, Peanuts" />
                <Stat label="Conditions" value="Hypertension" />
                <Stat label="Emergency" value="+91 98765 43210" />
                <Stat label="Insurer" value="HealthShield Plus" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for emergencies. Designed for life.</h2>
          <p className="mt-3 text-muted-foreground">
            From rapid SOS response to AI-driven prevention, every feature is engineered around your safety.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group bg-card border border-border rounded-2xl p-5 hover:shadow-elegant transition-all hover:-translate-y-0.5">
              <div className="size-11 rounded-xl bg-gradient-primary grid place-items-center mb-4 group-hover:shadow-glow transition-all">
                <Icon className="size-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 sm:p-16 text-center text-primary-foreground">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white, transparent 40%)" }} />
          <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight">Be ready before the emergency arrives.</h2>
          <p className="relative mt-3 max-w-xl mx-auto opacity-90">
            Set up your health ID in under 2 minutes. It might just save your life.
          </p>
          <Link to="/register" className="relative inline-block mt-6">
            <Button size="lg" variant="secondary" className="shadow-elegant-lg">
              Create my QR Health ID
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} QR Health ID — for demonstration purposes.
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 rounded-lg p-2.5">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-medium truncate">{value}</div>
    </div>
  );
}
