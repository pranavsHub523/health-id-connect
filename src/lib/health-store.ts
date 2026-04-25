// Mock localStorage-backed store for the health profile, auth & data.
// This is FRONT-END ONLY — replace with real API calls when backend is wired up.

import { useEffect, useState } from "react";

export type UserRole = "patient" | "doctor";

export type DoctorProfile = {
  licenseNumber: string;
  hospital: string;
  specialty: string;
  verified: boolean; // simulates admin verification of license/hospital ID
};

/** Permissions for RBAC. Patients & doctors have disjoint capability sets. */
export const PERMISSIONS = {
  patient: [
    "profile:edit",
    "qr:generate",
    "qr:share",
    "access:manage",
    "records:view-own",
    "sos:trigger",
  ] as const,
  doctor: [
    "patient:scan",
    "patient:request-access",
    "records:view-granted",
    "records:upload",
    "analytics:view",
  ] as const,
} as const;

export type Permission =
  | (typeof PERMISSIONS.patient)[number]
  | (typeof PERMISSIONS.doctor)[number];

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
  role: UserRole;
  /** Mock JWT — base64-encoded {sub, role, exp}. Replace with real JWT in backend. */
  token: string;
  doctor?: DoctorProfile;
};

/** A doctor's request to access a patient's full medical record. */
export type AccessRequest = {
  id: string;
  doctorId: string;
  doctorName: string;
  hospital: string;
  specialty: string;
  patientId: string; // the patient user id (or "self" in this mock)
  reason: string;
  status: "pending" | "approved" | "denied" | "revoked";
  requestedAt: string;
  decidedAt?: string;
  /** ISO date when access expires (24h after approval). */
  expiresAt?: string;
};

const AUTH_KEY = "qrhealth.auth.v1";
const PROFILE_KEY = "qrhealth.profile.v1";
const RECORDS_KEY = "qrhealth.records.v1";
const REQUESTS_KEY = "qrhealth.requests.v1";
const AUDIT_KEY = "qrhealth.audit.v1";

export type AuditEntry = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail?: string;
};

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

/** Mock JWT — DO NOT use in production. Real backend must sign with a server secret. */
function mockJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 7 * 864e5 }));
  const sig = btoa("mock-sig-" + Math.random().toString(36).slice(2));
  return `${header}.${body}.${sig}`;
}

export function getUser(): User | null {
  return safeGet<User | null>(AUTH_KEY, null);
}

export function login(opts: {
  email: string;
  name?: string;
  role: UserRole;
  doctor?: DoctorProfile;
}): User {
  const id = "u_" + Math.random().toString(36).slice(2, 10);
  const user: User = {
    id,
    email: opts.email,
    name: opts.name || opts.email.split("@")[0],
    role: opts.role,
    doctor: opts.role === "doctor" ? opts.doctor : undefined,
    token: mockJwt({ sub: id, role: opts.role, email: opts.email }),
  };
  safeSet(AUTH_KEY, user);
  return user;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("qrhealth:update"));
}

/** RBAC: check whether the current (or given) user has a permission. */
export function hasPermission(user: User | null, perm: Permission): boolean {
  if (!user) return false;
  const allowed = PERMISSIONS[user.role] as readonly string[];
  return allowed.includes(perm);
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

/* ----------- Access requests (doctor ↔ patient consent) ----------- */

const defaultRequests: AccessRequest[] = [
  {
    id: "ar_seed1",
    doctorId: "doc_seed",
    doctorName: "Dr. Neha Kulkarni",
    hospital: "Apollo Hospital",
    specialty: "Cardiology",
    patientId: "self",
    reason: "Follow-up consultation for hypertension management.",
    status: "pending",
    requestedAt: new Date(Date.now() - 36e5).toISOString(),
  },
];

export function getRequests(): AccessRequest[] {
  return safeGet(REQUESTS_KEY, defaultRequests);
}

export function saveRequests(rs: AccessRequest[]) {
  safeSet(REQUESTS_KEY, rs);
}

export function createRequest(input: Omit<AccessRequest, "id" | "status" | "requestedAt">): AccessRequest {
  const req: AccessRequest = {
    ...input,
    id: "ar_" + Math.random().toString(36).slice(2, 10),
    status: "pending",
    requestedAt: new Date().toISOString(),
  };
  saveRequests([req, ...getRequests()]);
  appendAudit({ actor: input.doctorName, action: "Requested record access", detail: input.reason });
  return req;
}

export function decideRequest(id: string, decision: "approved" | "denied" | "revoked", actor = "Patient") {
  const list = getRequests().map((r) =>
    r.id === id
      ? {
          ...r,
          status: decision,
          decidedAt: new Date().toISOString(),
          expiresAt: decision === "approved" ? new Date(Date.now() + 24 * 36e5).toISOString() : undefined,
        }
      : r,
  );
  saveRequests(list);
  const target = list.find((r) => r.id === id);
  if (target) {
    appendAudit({
      actor,
      action: `Access ${decision}`,
      detail: `${target.doctorName} (${target.hospital})`,
    });
  }
}

/** Doctor-side: does this doctor currently have approved, non-expired access? */
export function hasActiveAccess(doctorId: string, patientId = "self"): boolean {
  const now = Date.now();
  return getRequests().some(
    (r) =>
      r.doctorId === doctorId &&
      r.patientId === patientId &&
      r.status === "approved" &&
      (!r.expiresAt || new Date(r.expiresAt).getTime() > now),
  );
}

/* ----------- Audit log (simulated blockchain trail) ----------- */

export function getAudit(): AuditEntry[] {
  return safeGet<AuditEntry[]>(AUDIT_KEY, []);
}

export function appendAudit(e: Omit<AuditEntry, "id" | "at">) {
  const entry: AuditEntry = { ...e, id: "au_" + Math.random().toString(36).slice(2, 10), at: new Date().toISOString() };
  saveSet: {
    const list = [entry, ...getAudit()].slice(0, 100);
    safeSet(AUDIT_KEY, list);
  }
}

// React hook for live store subscription
export function useHealthStore() {
  const [user, setUser] = useState<User | null>(() => getUser());
  const [profile, setProfile] = useState<HealthProfile>(() => getProfile());
  const [records, setRecords] = useState<MedicalRecord[]>(() => getRecords());
  const [requests, setRequests] = useState<AccessRequest[]>(() => getRequests());
  const [audit, setAudit] = useState<AuditEntry[]>(() => getAudit());

  useEffect(() => {
    const sync = () => {
      setUser(getUser());
      setProfile(getProfile());
      setRecords(getRecords());
      setRequests(getRequests());
      setAudit(getAudit());
    };
    window.addEventListener("qrhealth:update", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("qrhealth:update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { user, profile, records, requests, audit };
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
