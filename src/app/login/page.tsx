"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicPageShell } from "@/components/PublicPageShell";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { getStudentProfile, loginStudent, saveStudentProfile } from "@/lib/student-auth";
import { checkStudentRegistration, syncStudentWithBackend } from "@/lib/student-registration";
import { OTP_LENGTH, isValidOtp, sendStudentWhatsappOtp, verifyStudentWhatsappOtp } from "@/lib/student-otp";
import type { GoogleStudent } from "@/lib/google-sign-in";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  "Quick login with Gmail or mobile OTP",
  "Registered Gmail profiles can sign in instantly",
  "Mock test and course redirects continue after login",
];

export default function LoginPage() {
  const router = useRouter();
  const [registerHref, setRegisterHref] = useState("/register");
  const [pendingStudent, setPendingStudent] = useState<GoogleStudent | null>(null);
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [error, setError] = useState("");

  const redirectAfterLogin = () => {
    const params = new URLSearchParams(window.location.search);
    router.push(params.get("redirect") || "/student/dashboard");
  };

  const finishLogin = async (student: {
    name: string;
    email: string;
    mobile?: string;
    stateId?: number;
    stateName?: string;
    provider?: "password" | "google" | "otp";
  }) => {
    saveStudentProfile({
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      stateId: student.stateId,
      stateName: student.stateName,
      provider: student.provider || "google",
      mobileVerified: true,
    });

    loginStudent({
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      stateId: student.stateId,
      stateName: student.stateName,
      provider: student.provider || "google",
    });

    try {
      await syncStudentWithBackend(student.email);
    } catch {
      // Local login should still work even if backend sync fails temporarily.
    }

    redirectAfterLogin();
  };

  const finishGoogleLogin = useCallback(async (student: GoogleStudent) => {
    setError("");

    try {
      const registration = await checkStudentRegistration({ email: student.email });
      if (!registration.email_exists) {
        setError("No account found with this email. Please register first.");
        window.setTimeout(() => router.push("/register"), 1800);
        return;
      }
    } catch (checkError) {
      setError(checkError instanceof Error ? checkError.message : "Unable to verify account.");
      return;
    }

    const profile = getStudentProfile(student.email);
    if (profile?.mobileVerified) {
      void finishLogin({
        name: profile.name || student.name,
        email: profile.email,
        mobile: profile.mobile,
        stateId: profile.stateId,
        stateName: profile.stateName,
        provider: "google",
      });
      return;
    }

    setPendingStudent(student);
    setMobile(profile?.mobile || "");
    setError("Mobile verification is pending for this Gmail account. Please verify OTP to complete login.");
  }, [router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    setRegisterHref(redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register");
  }, []);

  const startMobileOtpLogin = async (mobileNumber: string) => {
    const cleanedMobile = mobileNumber.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }

    setSendingOtp(true);
    setError("");
    try {
      const registration = await checkStudentRegistration({ mobile: cleanedMobile });
      if (!registration.mobile_exists || !registration.student) {
        setError("No account found with this mobile number. Please register first.");
        return;
      }

      await sendStudentWhatsappOtp(cleanedMobile);
      setPendingStudent({
        name: registration.student.name,
        email: registration.student.email,
      });
      setMobile(cleanedMobile);
      setOtp("");
      setOtpSent(true);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to send OTP on WhatsApp.");
    } finally {
      setSendingOtp(false);
    }
  };

  const sendOtp = async () => {
    const cleanedMobile = mobile.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanedMobile)) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }

    setSendingOtp(true);
    setError("");
    try {
      await sendStudentWhatsappOtp(cleanedMobile);
      setMobile(cleanedMobile);
      setOtp("");
      setOtpSent(true);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Unable to send OTP on WhatsApp.");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!pendingStudent) return;
    if (!isValidOtp(otp)) {
      setError(`Please enter the ${OTP_LENGTH} digit OTP sent on WhatsApp.`);
      return;
    }

    setVerifyingOtp(true);
    setError("");
    try {
      await verifyStudentWhatsappOtp(mobile, otp);

      const profile = saveStudentProfile({
        name: pendingStudent.name,
        email: pendingStudent.email,
        mobile,
        provider: pendingStudent.email.includes("@krlogics.local") ? "otp" : "google",
        mobileVerified: true,
      });

      await finishLogin({
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        provider: profile.provider,
      });
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "OTP verification failed.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <PublicPageShell className="min-h-screen bg-white text-[#1e1b3a]">
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_540px] lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] p-7 text-white shadow-[0_24px_70px_rgba(9, 40, 120,0.28)] sm:p-10" style={{ background: "linear-gradient(135deg, #0E318D 0%, #0538A1 52%, #0957D3 100%)" }}>
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute bottom-0 right-12 hidden h-44 w-44 rounded-t-full border-[24px] border-white/15 lg:block" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white ring-1 ring-white/15">
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
                  <CheckCircle2 size={18} className="text-white" />
                  <span className="text-sm font-bold text-white/84">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative min-h-[540px] overflow-hidden rounded-[34px] border border-[#0957D3]/15 bg-white p-7 shadow-[0_28px_80px_rgba(9, 87, 211,0.12)] sm:p-9">
          <div className="absolute inset-x-0 top-0 h-2 bg-[#0957D3]" />
          <div className="absolute -right-24 -top-20 h-56 w-56 rounded-full bg-[#0957D3]/10 blur-2xl" />
          <div className="absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-[#0957D3]/6 blur-2xl" />
          <div className="relative z-10">
            {!pendingStudent ? (
              <>
                <div>
                  <div className="inline-flex rounded-full bg-[#0957D3] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#0957D3]/20">Welcome Back</div>
                  <h2 className="mt-7 text-3xl font-black tracking-[-0.05em] text-[#1e1b3a] sm:text-4xl">Login to LMS</h2>
                  <p className="mt-4 text-[15px] font-semibold leading-7 text-[#64748b]">Use Gmail or mobile OTP to access your student account.</p>
                </div>

                <div className="mt-8 rounded-[28px] border border-[#0957D3]/15 bg-white p-5 shadow-[0_18px_44px_rgba(9, 87, 211,0.08)]">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0957D3] text-lg font-black text-white">G</span>
                    <div>
                      <p className="text-sm font-black text-[#1e1b3a]">Continue with Gmail</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-[#667085]">Use your Google account for quick student access.</p>
                    </div>
                  </div>
                  <GoogleSignInButton onSuccess={finishGoogleLogin} className="mt-0" />
                </div>

                <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#98a2b3]">
                  <span className="h-px flex-1 bg-[#e5e7eb]" /> or <span className="h-px flex-1 bg-[#e5e7eb]" />
                </div>

                <form
                  className="grid gap-4 rounded-[28px] border border-[#e6ebf3] bg-white/62 p-5 ring-1 ring-white/60"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const form = event.currentTarget;
                    const input = form.querySelector<HTMLInputElement>('input[name="mobile"]');
                    void startMobileOtpLogin(input?.value || "");
                  }}
                >
                  <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                    Mobile Number
                    <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#0957D3]">
                      <Phone size={18} className="text-[#7d8799]" />
                      <input name="mobile" className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="10 digit mobile number" />
                    </span>
                  </label>

                  <button type="submit" disabled={sendingOtp} className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0957D3] text-sm font-extrabold text-white shadow-lg shadow-blue-100 disabled:opacity-70">
                    {sendingOtp ? "Sending OTP..." : "Send OTP on WhatsApp"} <ArrowRight size={17} />
                  </button>
                </form>
              </>
            ) : (
              <>
                <button type="button" onClick={() => { setPendingStudent(null); setOtpSent(false); setOtp(""); setError(""); }} className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#0957D3]">
                  <ArrowLeft size={16} /> Back to Login
                </button>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#0957D3]">Mobile Verification</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#1e1b3a]">Verify Mobile OTP</h2>
                <div className="mt-4 rounded-2xl bg-[#f8fafc] p-4 ring-1 ring-[#dfe5ef]">
                  <p className="text-sm font-bold text-[#111827]">{pendingStudent.name}</p>
                  <p className="mt-1 text-sm font-semibold text-[#667085]">{pendingStudent.email}</p>
                </div>

                <div className="mt-6 grid gap-4">
                  <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                    Mobile Number
                    <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#0957D3]">
                      <Phone size={18} className="text-[#7d8799]" />
                      <input value={mobile} onChange={(event) => setMobile(event.target.value)} className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="10 digit mobile number" />
                    </span>
                  </label>

                  {otpSent && (
                    <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                      Enter OTP
                      <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#0957D3]">
                        <ShieldCheck size={18} className="text-[#7d8799]" />
                        <input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))} className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder={`${OTP_LENGTH} digit OTP`} />
                      </span>
                    </label>
                  )}

                  <button type="button" disabled={sendingOtp || verifyingOtp} onClick={() => void (otpSent ? verifyOtp() : sendOtp())} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0957D3] text-sm font-extrabold text-white shadow-lg shadow-blue-100 disabled:opacity-70">
                    {verifyingOtp ? "Verifying..." : sendingOtp ? "Sending OTP..." : otpSent ? "Verify OTP & Login" : "Resend OTP on WhatsApp"} <ArrowRight size={17} />
                  </button>
                </div>
              </>
            )}

            {error && <p className="mt-4 rounded-2xl bg-[#eef3ff] px-4 py-3 text-sm font-bold leading-6 text-[#0E318D]">{error}</p>}

            <p className="mt-6 text-center text-sm font-semibold text-[#667085]">
              Do not have an account? <Link href={registerHref} className="font-extrabold text-[#0957D3]">Create student account</Link>
            </p>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
