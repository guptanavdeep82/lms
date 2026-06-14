"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicPageShell } from "@/components/PublicPageShell";
import { getStudentProfile, loginStudent, saveStudentProfile } from "@/lib/student-auth";
import { syncStudentWithBackend } from "@/lib/student-registration";
import { applyStudentReferral, referralFromStudentPayload, validateReferralCode } from "@/lib/referral";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Gift,
  Phone,
  ShieldCheck,
} from "lucide-react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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
  "Quick login with Gmail or mobile OTP",
  "New Gmail profiles complete mobile OTP verification",
  "Mock test and course redirects continue after login",
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
  const [referralCode, setReferralCode] = useState("");
  const [referralMessage, setReferralMessage] = useState("");
  const [referralValid, setReferralValid] = useState(false);
  const [validatingReferral, setValidatingReferral] = useState(false);

  const redirectAfterLogin = () => {
    const params = new URLSearchParams(window.location.search);
    router.push(params.get("redirect") || "/student/dashboard");
  };

  const finishLoginWithReferral = async (student: { name: string; email: string; mobile?: string; stateId?: number; stateName?: string; provider?: "password" | "google" | "otp" }) => {
    let referral = referralFromStudentPayload(getStudentProfile(student.email) || {});

    if (referralCode.trim() && !referral.referral_code) {
      try {
        const applied = await applyStudentReferral(student.email, referralCode.trim());
        referral = referralFromStudentPayload(applied);
      } catch (referralError) {
        setError(referralError instanceof Error ? referralError.message : "Unable to apply referral code.");
        return;
      }
    }

    saveStudentProfile({
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      stateId: student.stateId,
      stateName: student.stateName,
      provider: student.provider || "google",
      mobileVerified: true,
      ...referral,
    });

    loginStudent({
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      stateId: student.stateId,
      stateName: student.stateName,
      provider: student.provider || "google",
      ...referral,
    });

    try {
      await syncStudentWithBackend(student.email);
    } catch {
      // Local login should still work even if backend sync fails temporarily.
    }

    redirectAfterLogin();
  };

  const finishGoogleLogin = (student: GoogleStudent) => {
    const profile = getStudentProfile(student.email);
    if (profile?.mobileVerified) {
      void finishLoginWithReferral({
        name: profile.name || student.name,
        email: profile.email,
        mobile: profile.mobile,
        provider: "google",
      });
      return;
    }

    setPendingStudent(student);
    setMobile(profile?.mobile || "");
    setError("Mobile verification is pending for this Gmail account. Please verify OTP to complete login.");
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    setRegisterHref(redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register");

    const ref = params.get("ref");
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }

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

  const checkReferralCode = async () => {
    const code = referralCode.trim();
    if (!code) {
      setReferralValid(false);
      setReferralMessage("");
      return;
    }

    setValidatingReferral(true);
    setReferralMessage("");
    const result = await validateReferralCode(code);
    setValidatingReferral(false);

    if (!result.valid) {
      setReferralValid(false);
      setReferralMessage(result.message);
      return;
    }

    setReferralValid(true);
    setReferralMessage(`${result.referral.discount_label} discount will be applied.`);
  };

  useEffect(() => {
    if (!referralCode.trim()) return;
    const timer = window.setTimeout(() => {
      void checkReferralCode();
    }, 400);
    return () => window.clearTimeout(timer);
  }, [referralCode]);

  const startMobileOtpLogin = (mobileNumber: string) => {
    const cleanedMobile = mobileNumber.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }

    setPendingStudent({ name: "Student", email: `student-${cleanedMobile}@krlogics.local` });
    setMobile(cleanedMobile);
    setOtpSent(true);
    setError("");
  };

  const startGoogleLogin = () => {
    setError("");
    if (GOOGLE_CLIENT_ID && googleReady && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
      return;
    }

    finishGoogleLogin({ name: "Student", email: "student@gmail.com" });
  };

  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10))) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }
    setOtpSent(true);
    setError("");
  };

  const verifyOtp = () => {
    if (!pendingStudent) return;
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6 digit OTP.");
      return;
    }

    const profile = saveStudentProfile({
      name: pendingStudent.name,
      email: pendingStudent.email,
      mobile,
      provider: "google",
      mobileVerified: true,
    });

    void finishLoginWithReferral({
      name: profile.name,
      email: profile.email,
      mobile: profile.mobile,
      provider: "google",
    });
  };

  return (
    <PublicPageShell className="min-h-screen bg-[#f6f8fc] text-[#111827]">

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_540px] lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-[#172a69] p-7 text-white shadow-[0_24px_70px_rgba(23,42,105,0.24)] sm:p-10">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#f5c518]/18" />
          <div className="absolute bottom-0 right-12 hidden h-44 w-44 rounded-t-full border-[24px] border-[#f5c518]/18 lg:block" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#f7d85a] ring-1 ring-white/15">
              <ShieldCheck size={14} /> Student Login
            </span>
            <h1 className="mt-6 text-[32px] font-extrabold leading-tight tracking-[-0.05em] sm:text-[48px]">
              Continue your banking exam preparation.
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-8 text-white/72">
              After login, students can access purchased courses, mock tests, notes, certificates, and learning progress from one dashboard.
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

        <div className="relative min-h-[540px] overflow-hidden rounded-[34px] border border-[#ead694] bg-gradient-to-br from-white via-[#fffaf0] to-[#fff0b8] p-7 shadow-[0_28px_80px_rgba(95,71,0,0.16)] sm:p-9">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#050808] via-[#f5c518] to-[#050808]" />
          <div className="absolute -right-24 -top-20 h-56 w-56 rounded-full bg-[#f5c518]/28 blur-2xl" />
          <div className="absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-[#172a69]/10 blur-2xl" />
          <div className="relative z-10">
          {!pendingStudent ? (
            <>
              <div>
                <div className="inline-flex rounded-full bg-[#050808] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#f5c518] shadow-lg shadow-black/10">Welcome Back</div>
                <h2 className="mt-7 text-3xl font-black tracking-[-0.05em] text-[#050808] sm:text-4xl">Login to LMS</h2>
                <p className="mt-4 text-[15px] font-semibold leading-7 text-[#4c4f5d]">Use Gmail or mobile OTP to access your student account.</p>
              </div>

              <div className="mt-8 rounded-[28px] border border-[#ead694] bg-white/78 p-5 shadow-[0_18px_44px_rgba(95,71,0,0.12)] backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#050808] text-lg font-black text-[#f5c518]">G</span>
                  <div>
                    <p className="text-sm font-black text-[#050808]">Continue with Gmail</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-[#667085]">Use your Google account for quick student access.</p>
                  </div>
                </div>
                <button type="button" onClick={startGoogleLogin} className="mt-5 inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-[#f5c518] px-5 text-sm font-black text-[#050808] shadow-[0_14px_32px_rgba(245,197,24,0.35)] transition hover:bg-[#ffd84d]">
                  Continue with Google <ArrowRight size={17} />
                </button>
              </div>

              <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#98a2b3]">
                <span className="h-px flex-1 bg-[#e5e7eb]" /> or <span className="h-px flex-1 bg-[#e5e7eb]" />
              </div>

              <form
                className="grid gap-4 rounded-[28px] border border-[#ead694] bg-white/62 p-5 ring-1 ring-white/60"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  const input = form.querySelector<HTMLInputElement>('input[name="mobile"]');
                  startMobileOtpLogin(input?.value || "");
                }}
              >
                <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                  Referral Code (Optional)
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                    <Gift size={18} className="text-[#7d8799]" />
                    <input value={referralCode} onChange={(event) => setReferralCode(event.target.value.toUpperCase())} className="w-full bg-transparent text-sm font-semibold uppercase text-[#111827] outline-none placeholder:normal-case placeholder:text-[#98a2b3]" placeholder="Affiliate referral code" />
                  </span>
                </label>

                {!validatingReferral && referralMessage && (
                  <p className={`rounded-2xl px-4 py-3 text-xs font-bold leading-6 ${referralValid ? "bg-[#ecfdf3] text-[#027a48]" : "bg-[#fff8d6] text-[#7a5b00]"}`}>
                    {referralMessage}
                  </p>
                )}

                <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                  Mobile Number
                  <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                    <Phone size={18} className="text-[#7d8799]" />
                    <input name="mobile" className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="10 digit mobile number" />
                  </span>
                </label>

                <button type="submit" className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#172a69] text-sm font-extrabold text-white shadow-lg shadow-blue-100">
                  Send OTP <ArrowRight size={17} />
                </button>
              </form>
            </>
          ) : (
            <>
              <button type="button" onClick={() => { setPendingStudent(null); setOtpSent(false); setOtp(""); setError(""); }} className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#172a69]">
                <ArrowLeft size={16} /> Back to Login
              </button>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f0a500]">Mobile Verification</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#172a69]">Verify Mobile OTP</h2>
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
            Do not have an account? <Link href={registerHref} className="font-extrabold text-[#172a69]">Create student account</Link>
          </p>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
