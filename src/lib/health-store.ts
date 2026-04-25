// Mock localStorage-backed store for the health profile, auth & data.
// This is FRONT-END ONLY — replace with real API calls when backend is wired up.

import { useEffect, useState } from "react";

export type EmergencyContact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
};

export type MedicalRecord = {
  id: string;
  title: string;
  type: "prescription" | "lab" | "imaging" | "report" | "insurance";
  date: string;
  doctor?: string;
  notes?: string;
};

export type HealthProfile = {
  fullName: string;
  age: number;
  gender: "male" | "female" | "other";
  bloodGroup: string;
  height: number; // cm
  weight: number; // kg
  allergies: string[];
  conditions: string[];
  medications: Medication[];
  emergencyContacts: EmergencyContact[];
  insuranceProvider?: string;
  insuranceNumber?: string;
  aadhaarLinked?: boolean;
  organDonor?: boolean;
  language: "en" | "hi" | "es" | "fr";
  voiceAssistance: boolean;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

const AUTH_KEY = "qrhealth.auth.v1";
const PROFILE_KEY = "qrhealth.profile.v1";
const RECORDS_KEY = "qrhealth.records.v1";

const defaultProfile: HealthProfile = {
  fullName: "Aarav Sharma",
  age: 32,
  gender: "male",
  bloodGroup: "O+",
  height: 178,
  weight: 76,
  allergies: ["Penicillin", "Peanuts"],
  conditions: ["Hypertension"],
  medications: [
    { id: "m1", name: "Amlodipine", dosage: "5 mg", frequency: "Once daily" },
    { id: "m2", name: "Vitamin D3", dosage: "1000 IU", frequency: "Once daily" },
  ],
  emergencyContacts: [
    { id: "e1", name: "Priya Sharma", relation: "Spouse", phone: "+91 98765 43210" },
    { id: "e2", name: "Dr. Verma", relation: "Family Doctor", phone: "+91 99887 76655" },
  ],
  insuranceProvider: "HealthShield Plus",
  insuranceNumber: "HS-9081-2245-7710",
  aadhaarLinked: true,
  organDonor: true,
  language: "en",
  voiceAssistance: false,
};

const defaultRecords: MedicalRecord[] = [
  { id: "r1", title: "Annual Blood Panel", type: "lab", date: "2025-02-10", doctor: "Dr. Meena Kapoor", notes: "All markers normal." },
  { id: "r2", title: "Chest X-Ray", type: "imaging", date: "2024-11-22", doctor: "Dr. Verma" },
  { id: "r3", title: "Hypertension Prescription", type: "prescription", date: "2025-03-01", doctor: "Dr. Verma" },
  { id: "r4", title: "Insurance Policy 2025", type: "insurance", date: "2025-01-01" },
];

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(val));
  window.dispatchEvent(new Event("qrhealth:update"));
}

export function getUser(): User | null {
  return safeGet<User | null>(AUTH_KEY, null);
}

export function login(email: string, name?: string): User {
  const user: User = {
    id: "u_" + Math.random().toString(36).slice(2, 10),
    email,
    name: name || email.split("@")[0],
  };
  safeSet(AUTH_KEY, user);
  return user;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("qrhealth:update"));
}

export function getProfile(): HealthProfile {
  return safeGet(PROFILE_KEY, defaultProfile);
}

export function saveProfile(p: HealthProfile) {
  safeSet(PROFILE_KEY, p);
}

export function getRecords(): MedicalRecord[] {
  return safeGet(RECORDS_KEY, defaultRecords);
}

export function saveRecords(r: MedicalRecord[]) {
  safeSet(RECORDS_KEY, r);
}

// React hook for live store subscription
export function useHealthStore() {
  const [user, setUser] = useState<User | null>(() => getUser());
  const [profile, setProfile] = useState<HealthProfile>(() => getProfile());
  const [records, setRecords] = useState<MedicalRecord[]>(() => getRecords());

  useEffect(() => {
    const sync = () => {
      setUser(getUser());
      setProfile(getProfile());
      setRecords(getRecords());
    };
    window.addEventListener("qrhealth:update", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("qrhealth:update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { user, profile, records };
}

// Build the QR payload (a URL pointing to the public emergency view)
export function buildQrUrl(profile: HealthProfile): string {
  if (typeof window === "undefined") return "";
  const minimal = {
    n: profile.fullName,
    a: profile.age,
    b: profile.bloodGroup,
    al: profile.allergies,
    c: profile.conditions,
    ec: profile.emergencyContacts.map((e) => ({ n: e.name, p: e.phone, r: e.relation })),
  };
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(minimal))));
  return `${window.location.origin}/emergency/${encoded}`;
}

export function parseQrPayload(encoded: string): Partial<HealthProfile> | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const data = JSON.parse(json);
    return {
      fullName: data.n,
      age: data.a,
      bloodGroup: data.b,
      allergies: data.al || [],
      conditions: data.c || [],
      emergencyContacts: (data.ec || []).map((e: { n: string; p: string; r: string }, i: number) => ({
        id: "e" + i,
        name: e.n,
        relation: e.r,
        phone: e.p,
      })),
    };
  } catch {
    return null;
  }
}
