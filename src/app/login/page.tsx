"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  "Purchased courses ka instant access",
  "Mock tests, notes aur live classes ek dashboard me",
  "Secure OTP + password based student login",
];

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/student/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <header className="border-b border-[#e4e8f1] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#172a69] text-white shadow-xl shadow-blue-100">
              <BookOpen size={22} />
            </div>
            <div>
              <p className="text-lg font-extrabold leading-tight text-[#172a69]">KR Logics</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8791a5]">Student LMS</p>
            </div>
          </Link>
          <Link href="/register" className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#172a69] px-5 text-sm font-extrabold text-white">
            Register <ArrowRight size={16} />
          </Link>
        </div>
      </header>

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
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f0a500]">Welcome Back</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#172a69]">Login to LMS</h2>
            <p className="mt-2 text-sm leading-6 text-[#667085]">Apna mobile number ya email use karke login karein.</p>
          </div>

          <form
            className="mt-7 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleLogin();
            }}
          >
            <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
              Email or Mobile Number
              <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                <Mail size={18} className="text-[#7d8799]" />
                <input className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="student@email.com or +91 XXXXX XXXXX" />
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

            <Link href="/student/dashboard" className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#172a69] text-sm font-extrabold text-white shadow-lg shadow-blue-100">
              Login Now <ArrowRight size={17} />
            </Link>
            <button type="button" onClick={handleLogin} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#dfe5ef] bg-white text-sm font-extrabold text-[#172a69]">
              <Phone size={17} /> Login with OTP
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-[#667085]">
            Account nahi hai? <Link href="/register" className="font-extrabold text-[#172a69]">Create student account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
