"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { getStudentProfile, loginStudent, saveStudentProfile } from "@/lib/student-auth";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
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

const benefits = [
  "Gmail se quick student login",
  "New Gmail profile par mobile OTP verification",
  "Mock tests aur courses ke redirect flow preserve honge",
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

export default function LoginPage() {
  const router = useRouter();
  const [registerHref, setRegisterHref] = useState("/register");
  const [googleReady, setGoogleReady] = useState(false);
  const [pendingStudent, setPendingStudent] = useState<GoogleStudent | null>(null);
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const redirectAfterLogin = () => {
    const params = new URLSearchParams(window.location.search);
    router.push(params.get("redirect") || "/student/dashboard");
  };

  const finishGoogleLogin = (student: GoogleStudent) => {
    const profile = getStudentProfile(student.email);
    if (profile?.mobileVerified) {
      loginStudent({
        name: profile.name || student.name,
        email: profile.email,
        mobile: profile.mobile,
        provider: "google",
      });
      redirectAfterLogin();
      return;
    }

    setPendingStudent(student);
    setMobile(profile?.mobile || "");
    setError("Is Gmail ke liye mobile verification pending hai. OTP verify karke login complete karein.");
  };

  useEffect(() => {
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    setRegisterHref(redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register");

    if (!GOOGLE_CLIENT_ID) return;

    const loadGoogle = () => {
      window.google?.accounts?.id?.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (!response.credential) return;
          const student = decodeGoogleCredential(response.credential);
          if (student) finishGoogleLogin(student);
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

  const handleLogin = (email = "student@email.com") => {
    const profile = getStudentProfile(email);
    loginStudent({
      name: profile?.name,
      email,
      mobile: profile?.mobile,
      provider: profile?.provider || "password",
    });
    redirectAfterLogin();
  };

  const startGoogleLogin = () => {
    setError("");
    if (GOOGLE_CLIENT_ID && googleReady && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
      return;
    }

    finishGoogleLogin({ name: "Student Demo", email: "student@gmail.com" });
    setError("Google client id env me set nahi hai, isliye demo Gmail profile se login flow show ho raha hai.");
  };

  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10))) {
      setError("Please valid 10 digit mobile number enter karein.");
      return;
    }
    setOtpSent(true);
    setError(`Demo OTP ${DEMO_OTP} hai. Backend SMS API connect hone par real OTP send hoga.`);
  };

  const verifyOtp = () => {
    if (!pendingStudent) return;
    if (otp !== DEMO_OTP) {
      setError("Invalid OTP. Demo ke liye 123456 use karein.");
      return;
    }

    const profile = saveStudentProfile({
      name: pendingStudent.name,
      email: pendingStudent.email,
      mobile,
      provider: "google",
      mobileVerified: true,
    });

    loginStudent({
      name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      provider: "google",
    });
    redirectAfterLogin();
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <PublicHeader />

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_480px] lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-[#172a69] p-7 text-white shadow-[0_24px_70px_rgba(23,42,105,0.24)] sm:p-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#f5c518]/18" />
          <div className="absolute bottom-0 right-12 hidden h-44 w-44 rounded-t-full border-[24px] border-[#f5c518]/18 lg:block" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#f7d85a] ring-1 ring-white/15">
              <ShieldCheck size={14} /> Student Login
            </span>
            <h1 className="mt-6 text-[38px] font-extrabold leading-tight tracking-[-0.05em] sm:text-[58px]">
              Continue your banking exam preparation.
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-8 text-white/72">
              Login ke baad student apne purchased courses, mock tests, notes, certificates aur learning progress access kar payega.
            </p>
            <div className="mt-8 grid gap-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 ring-1 ring-white/10">
                  <CheckCircle2 size={18} className="text-[#f5c518]" />
                  <span className="text-sm font-bold text-white/84">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#dfe5ef] bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] sm:p-8">
          {!pendingStudent ? (
            <>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f0a500]">Welcome Back</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#172a69]">Login to LMS</h2>
                <p className="mt-2 text-sm leading-6 text-[#667085]">Gmail se login karein ya email/mobile password use karein.</p>
              </div>

              <button type="button" onClick={startGoogleLogin} className="mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-[#dfe5ef] bg-white text-sm font-extrabold text-[#172a69] shadow-sm transition hover:bg-[#f8fafc]">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-lg shadow-sm">G</span>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#98a2b3]">
                <span className="h-px flex-1 bg-[#e5e7eb]" /> or <span className="h-px flex-1 bg-[#e5e7eb]" />
              </div>

              <form
                className="grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  const input = form.querySelector<HTMLInputElement>('input[name="email"]');
                  handleLogin(input?.value || "student@email.com");
                }}
              >
                <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                  Email or Mobile Number
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                    <Mail size={18} className="text-[#7d8799]" />
                    <input name="email" className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="student@email.com or +91 XXXXX XXXXX" defaultValue="student@email.com" />
                  </span>
                </label>

                <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                  Password
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                    <LockKeyhole size={18} className="text-[#7d8799]" />
                    <input type="password" className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="Enter password" />
                    <Eye size={18} className="text-[#98a2b3]" />
                  </span>
                </label>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-2 font-semibold text-[#667085]">
                    <input type="checkbox" className="h-4 w-4 rounded border-[#d0d5dd]" />
                    Remember me
                  </label>
                  <a href="#" className="font-extrabold text-[#172a69]">Forgot password?</a>
                </div>

                <button type="submit" className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#172a69] text-sm font-extrabold text-white shadow-lg shadow-blue-100">
                  Login Now <ArrowRight size={17} />
                </button>
                <button type="button" onClick={() => handleLogin()} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dfe5ef] bg-white text-sm font-extrabold text-[#172a69]">
                  <Phone size={17} /> Login with OTP
                </button>
              </form>
            </>
          ) : (
            <>
              <button type="button" onClick={() => { setPendingStudent(null); setOtpSent(false); setOtp(""); setError(""); }} className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#172a69]">
                <ArrowLeft size={16} /> Back to Login
              </button>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f0a500]">Mobile Verification</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#172a69]">Verify Mobile OTP</h2>
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
                  {otpSent ? "Verify OTP & Login" : "Send OTP"} <ArrowRight size={17} />
                </button>
              </div>
            </>
          )}

          {error && <p className="mt-4 rounded-2xl bg-[#fff8d6] px-4 py-3 text-sm font-bold leading-6 text-[#7a5b00]">{error}</p>}

          <p className="mt-6 text-center text-sm font-semibold text-[#667085]">
            Account nahi hai? <Link href={registerHref} className="font-extrabold text-[#172a69]">Create student account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
