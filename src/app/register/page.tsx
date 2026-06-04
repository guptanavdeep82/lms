"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { loginStudent, saveStudentProfile } from "@/lib/student-auth";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const DEMO_OTP = "123456";

type GoogleStudent = {
  name: string;
  email: string;
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
  "Continue with Google se name aur Gmail fetch hoga",
  "Mobile number OTP se verify hoga",
  "Verified student profile ke saath dashboard open hoga",
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

  const completeLogin = (student: GoogleStudent, verifiedMobile: string) => {
    const profile = saveStudentProfile({
      name: student.name,
      email: student.email,
      mobile: verifiedMobile,
      provider: "google",
      mobileVerified: true,
    });

    loginStudent({
      name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      provider: "google",
    });

    const params = new URLSearchParams(window.location.search);
    router.push(params.get("redirect") || "/student/dashboard");
  };

  useEffect(() => {
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

    setPendingStudent({ name: "Student Demo", email: "student@gmail.com" });
    setError("Google client id env me set nahi hai, isliye demo Gmail profile se OTP step show ho raha hai.");
  };

  const handleManualRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.querySelector<HTMLInputElement>('input[name="name"]')?.value || "Student";
    const email = form.querySelector<HTMLInputElement>('input[name="email"]')?.value || "student@gmail.com";
    const mobileValue = form.querySelector<HTMLInputElement>('input[name="mobile"]')?.value || "";
    setPendingStudent({ name, email });
    setMobile(mobileValue);
    setError("");
  };

  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10))) {
      setError("Please valid 10 digit mobile number enter karein.");
      return;
    }
    setOtpSent(true);
    setError(`Demo OTP ${DEMO_OTP} hai. Backend SMS API connect hone par yahan real OTP send hoga.`);
  };

  const verifyOtp = () => {
    if (!pendingStudent) return;
    if (otp !== DEMO_OTP) {
      setError("Invalid OTP. Demo ke liye 123456 use karein.");
      return;
    }
    completeLogin(pendingStudent, mobile);
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <PublicHeader />

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[470px_1fr] lg:px-8">
        <div className="rounded-[32px] border border-[#dfe5ef] bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] sm:p-8">
          {!pendingStudent ? (
            <>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f0a500]">Student Registration</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#172a69]">Create Account</h1>
              <p className="mt-2 text-sm leading-6 text-[#667085]">Google signup se Gmail aur name auto fetch hoga. Uske baad mobile OTP verification complete karein.</p>

              <button type="button" onClick={startGoogleSignup} className="mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#dfe5ef] bg-white text-sm font-extrabold text-[#172a69] shadow-sm transition hover:bg-[#f8fafc]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-lg shadow-sm">G</span>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#98a2b3]">
                <span className="h-px flex-1 bg-[#e5e7eb]" /> or fill manually <span className="h-px flex-1 bg-[#e5e7eb]" />
              </div>

              <form className="grid gap-4" onSubmit={handleManualRegister}>
                <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                  Full Name
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                    <User size={18} className="text-[#7d8799]" />
                    <input name="name" className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="Enter student name" />
                  </span>
                </label>

                <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                  Gmail
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                    <Mail size={18} className="text-[#7d8799]" />
                    <input name="email" type="email" className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="student@gmail.com" defaultValue="student@gmail.com" />
                  </span>
                </label>

                <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                  Mobile
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                    <Phone size={18} className="text-[#7d8799]" />
                    <input name="mobile" className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="10 digit mobile number" />
                  </span>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                    Target Exam
                    <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                      <GraduationCap size={18} className="text-[#7d8799]" />
                      <select className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none">
                        <option>IBPS PO / Clerk</option>
                        <option>SBI PO / Clerk</option>
                        <option>RBI Grade B</option>
                        <option>Insurance Exams</option>
                      </select>
                    </span>
                  </label>
                  <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                    City
                    <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                      <MapPin size={18} className="text-[#7d8799]" />
                      <input className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="City" />
                    </span>
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                  Password
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                    <LockKeyhole size={18} className="text-[#7d8799]" />
                    <input type="password" className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="Create password" />
                  </span>
                </label>

                <button type="submit" className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#172a69] text-sm font-extrabold text-white shadow-lg shadow-blue-100">
                  Continue to Mobile OTP <ArrowRight size={17} />
                </button>
              </form>
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
