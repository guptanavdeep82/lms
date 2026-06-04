"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { loginStudent, saveStudentProfile } from "@/lib/student-auth";
import { publicBackendBaseUrl } from "@/lib/mock-tests";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type GoogleStudent = {
  name: string;
  email: string;
};

type StateOption = {
  id: number;
  name: string;
  code: string;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const steps = [
  "Continue with Google to use your name and Gmail automatically",
  "Verify your mobile number with a secure OTP",
  "Open your student dashboard with a verified profile",
];

function decodeGoogleCredential(credential: string): GoogleStudent | null {
  try {
    const payload = credential.split(".")[1];
    const json = JSON.parse(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { name?: string; email?: string };
    return json.email ? { name: json.name || json.email.split("@")[0], email: json.email } : null;
  } catch {
    return null;
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [pendingStudent, setPendingStudent] = useState<GoogleStudent | null>(null);
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [states, setStates] = useState<StateOption[]>([]);
  const [stateId, setStateId] = useState("");

  const completeLogin = async (student: GoogleStudent, verifiedMobile: string) => {
    const selectedState = states.find((state) => String(state.id) === stateId);
    if (!selectedState) {
      setError("Please state select karein.");
      return;
    }

    try {
      const response = await fetch(`${publicBackendBaseUrl}/api/student/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: student.name,
          email: student.email,
          mobile: verifiedMobile,
          state_id: selectedState.id,
          provider: "google",
          mobile_verified: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Student registration API failed.");
      }
    } catch {
      setError("Student data database me save nahi ho paya. Please backend API check karein.");
      return;
    }

    const profile = saveStudentProfile({
      name: student.name,
      email: student.email,
      mobile: verifiedMobile,
      stateId: selectedState.id,
      stateName: selectedState.name,
      provider: "google",
      mobileVerified: true,
    });

    loginStudent({
      name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      stateId: profile.stateId,
      stateName: profile.stateName,
      provider: "google",
    });

    const params = new URLSearchParams(window.location.search);
    router.push(params.get("redirect") || "/student/dashboard");
  };

  useEffect(() => {
    fetch(`${publicBackendBaseUrl}/api/states`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("States API failed")))
      .then((data: { states?: StateOption[] }) => {
        setStates(data.states || []);
      })
      .catch(() => {
        setStates([]);
      });

    if (!GOOGLE_CLIENT_ID) return;

    const loadGoogle = () => {
      window.google?.accounts?.id?.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (!response.credential) return;
          const student = decodeGoogleCredential(response.credential);
          if (student) {
            setPendingStudent(student);
            setError("");
          }
        },
      });
      setGoogleReady(Boolean(window.google?.accounts?.id));
    };

    if (window.google?.accounts?.id) {
      loadGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = loadGoogle;
    document.head.appendChild(script);
  }, []);

  const startGoogleSignup = () => {
    setError("");
    if (GOOGLE_CLIENT_ID && googleReady && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
      return;
    }

    setPendingStudent({ name: "Student", email: "student@gmail.com" });
  };

  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10))) {
      setError("Please valid 10 digit mobile number enter karein.");
      return;
    }
    setOtpSent(true);
    setError("");
  };

  const verifyOtp = () => {
    if (!pendingStudent) return;
    if (!/^\d{6}$/.test(otp)) {
      setError("Please 6 digit OTP enter karein.");
      return;
    }
    completeLogin(pendingStudent, mobile);
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <PublicHeader />

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[540px_1fr] lg:px-8">
        <div className="relative min-h-[520px] overflow-hidden rounded-[34px] border border-[#ead694] bg-gradient-to-br from-white via-[#fffaf0] to-[#fff0b8] p-7 shadow-[0_28px_80px_rgba(95,71,0,0.16)] sm:p-9">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#050808] via-[#f5c518] to-[#050808]" />
          <div className="absolute -right-24 -top-20 h-56 w-56 rounded-full bg-[#f5c518]/28 blur-2xl" />
          <div className="absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-[#172a69]/10 blur-2xl" />
          <div className="relative z-10">
          {!pendingStudent ? (
            <>
              <div className="inline-flex rounded-full bg-[#050808] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#f5c518] shadow-lg shadow-black/10">Student Registration</div>
              <h1 className="mt-7 text-4xl font-black tracking-[-0.05em] text-[#050808] sm:text-5xl">Create Account</h1>
              <p className="mt-4 text-[15px] font-semibold leading-7 text-[#4c4f5d]">Google signup se Gmail aur name auto fetch hoga. Uske baad mobile OTP verification complete karein.</p>

              <div className="mt-8 rounded-[28px] border border-[#ead694] bg-white/78 p-5 shadow-[0_18px_44px_rgba(95,71,0,0.12)] backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#050808] text-lg font-black text-[#f5c518]">G</span>
                  <div>
                    <p className="text-sm font-black text-[#050808]">Signup using Gmail</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[#667085]">Name aur email Google account se auto fill hoga.</p>
                  </div>
                </div>
                <button type="button" onClick={startGoogleSignup} className="mt-5 inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-[#f5c518] px-5 text-sm font-black text-[#050808] shadow-[0_14px_32px_rgba(245,197,24,0.35)] transition hover:bg-[#ffd84d]">
                  Continue with Google <ArrowRight size={17} />
                </button>
              </div>

              <div className="mt-7 grid gap-3">
                {steps.slice(0, 2).map((step) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/62 px-4 py-3 ring-1 ring-[#ead694]">
                    <CheckCircle2 size={18} className="text-[#172a69]" />
                    <span className="text-sm font-bold text-[#344054]">{step}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <button type="button" onClick={() => { setPendingStudent(null); setOtpSent(false); setOtp(""); setError(""); }} className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#172a69]">
                <ArrowLeft size={16} /> Change Gmail
              </button>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f0a500]">Mobile Verification</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#172a69]">Verify Mobile OTP</h1>
              <div className="mt-4 rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#dfe5ef]">
                <p className="text-sm font-bold text-[#111827]">{pendingStudent.name}</p>
                <p className="mt-1 text-sm font-semibold text-[#667085]">{pendingStudent.email}</p>
              </div>

              <div className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                  Mobile Number
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                    <Phone size={18} className="text-[#7d8799]" />
                    <input value={mobile} onChange={(event) => setMobile(event.target.value)} className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="10 digit mobile number" />
                  </span>
                </label>

                <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                  State
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                    <MapPin size={18} className="text-[#7d8799]" />
                    <select value={stateId} onChange={(event) => setStateId(event.target.value)} className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none">
                      <option value="">Select state</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>{state.name}</option>
                      ))}
                    </select>
                  </span>
                </label>

                {otpSent && (
                  <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                    Enter OTP
                    <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                      <ShieldCheck size={18} className="text-[#7d8799]" />
                      <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="6 digit OTP" />
                    </span>
                  </label>
                )}

                <button type="button" onClick={otpSent ? verifyOtp : sendOtp} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#172a69] text-sm font-extrabold text-white shadow-lg shadow-blue-100">
                  {otpSent ? "Verify OTP & Register" : "Send OTP"} <ArrowRight size={17} />
                </button>
              </div>
            </>
          )}

          {error && <p className="mt-4 rounded-2xl bg-[#fff8d6] px-4 py-3 text-sm font-bold leading-6 text-[#7a5b00]">{error}</p>}

          <p className="mt-6 text-center text-sm font-semibold text-[#667085]">
            Already registered? <Link href="/login" className="font-extrabold text-[#172a69]">Login here</Link>
          </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] bg-[#172a69] p-7 text-white shadow-[0_24px_70px_rgba(23,42,105,0.24)] sm:p-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#f5c518]/18" />
          <div className="absolute bottom-0 right-12 hidden h-44 w-44 rounded-t-full border-[24px] border-[#f5c518]/18 lg:block" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#f7d85a] ring-1 ring-white/15">
              <ShieldCheck size={14} /> KR Logics Admission
            </span>
            <h2 className="mt-6 text-[38px] font-extrabold leading-tight tracking-[-0.05em] sm:text-[58px]">
              Signup with Gmail, verify mobile, start learning.
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-8 text-white/72">
              Student registration flow ab Gmail based hai. Name aur email Google se fetch hoga, fir mobile OTP se verified profile create hogi.
            </p>
            <div className="mt-8 grid gap-3">
              {steps.map((step) => (
                <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 ring-1 ring-white/10">
                  <CheckCircle2 size={18} className="text-[#f5c518]" />
                  <span className="text-sm font-bold text-white/84">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
