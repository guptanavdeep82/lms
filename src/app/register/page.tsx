"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { loginStudent } from "@/lib/student-auth";
import {
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

const steps = [
  "Basic student details submit karein",
  "Mobile OTP se account verify karein",
  "Course select karke learning start karein",
];

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.querySelector<HTMLInputElement>('input[name="email"]')?.value || "student@email.com";
    loginStudent(email);
    const params = new URLSearchParams(window.location.search);
    router.push(params.get("redirect") || "/student/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <PublicHeader />

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[470px_1fr] lg:px-8">
        <div className="rounded-[32px] border border-[#dfe5ef] bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f0a500]">Student Registration</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#172a69]">Create Account</h1>
          <p className="mt-2 text-sm leading-6 text-[#667085]">Register karke free demo, course purchase aur student dashboard access karein.</p>

          <form
            className="mt-7 grid gap-4"
            onSubmit={handleRegister}
          >
            <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
              Full Name
              <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                <User size={18} className="text-[#7d8799]" />
                <input name="name" className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="Enter student name" />
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                Mobile
                <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                  <Phone size={18} className="text-[#7d8799]" />
                  <input name="mobile" className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="+91" />
                </span>
              </label>
              <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
                Email
                <span className="flex h-12 items-center gap-3 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 focus-within:border-[#172a69]">
                  <Mail size={18} className="text-[#7d8799]" />
                  <input name="email" type="email" className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none placeholder:text-[#98a2b3]" placeholder="Email" defaultValue="student@email.com" />
                </span>
              </label>
            </div>

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

            <label className="flex items-start gap-2 text-sm font-semibold leading-6 text-[#667085]">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#d0d5dd]" />
              I agree to receive course updates, mock test notifications and account related communication.
            </label>

            <button type="submit" className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#172a69] text-sm font-extrabold text-white shadow-lg shadow-blue-100">
              Register Student <ArrowRight size={17} />
            </button>
          </form>

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
              Start your exam journey with a focused study plan.
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-8 text-white/72">
              Registration ke baad student profile create hoti hai, jisme purchased courses, progress, test history aur certificates track honge.
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
