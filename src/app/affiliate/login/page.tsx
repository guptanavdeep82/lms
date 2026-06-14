"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { getAffiliateSession, saveAffiliateSession } from "@/lib/affiliate";
import { publicBackendBaseUrl } from "@/lib/mock-tests";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";

export default function AffiliateLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAffiliateSession()) {
      router.replace("/affiliate/dashboard");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${publicBackendBaseUrl}/api/affiliate/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({})) as {
        affiliate?: { id: number; name: string; email: string };
        message?: string;
      };

      if (!response.ok || !data.affiliate) {
        throw new Error(data.message || "Invalid affiliate credentials.");
      }

      saveAffiliateSession(data.affiliate);
      router.push("/affiliate/dashboard");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <PublicHeader />

      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_480px] lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] bg-[#172a69] p-8 text-white shadow-[0_24px_70px_rgba(23,42,105,0.24)]">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#f5c518]/18" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#f7d85a] ring-1 ring-white/15">
              <Users size={14} /> Affiliate Panel
            </span>
            <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Track your referred students</h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/72">
              Admin dwara diya gaya email aur password se login karein. Yahan aap apne referral codes aur unse register hue students dekh sakte hain.
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#ead694] bg-white p-8 shadow-[0_28px_80px_rgba(95,71,0,0.12)]">
          <div className="inline-flex rounded-full bg-[#050808] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#f5c518]">Affiliate Login</div>
          <h2 className="mt-5 text-xl font-black text-[#050808]">Welcome back</h2>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="h-12 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 text-sm font-semibold outline-none focus:border-[#172a69]" />
            </label>
            <label className="grid gap-2 text-sm font-extrabold text-[#344054]">
              Password
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength={6} className="h-12 rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 text-sm font-semibold outline-none focus:border-[#172a69]" />
            </label>
            <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#172a69] text-sm font-extrabold text-white disabled:opacity-70">
              {loading ? "Logging in..." : "Login"} <ArrowRight size={17} />
            </button>
          </form>

          {error && <p className="mt-4 rounded-2xl bg-[#fff8d6] px-4 py-3 text-sm font-bold text-[#7a5b00]">{error}</p>}

          <p className="mt-6 text-center text-sm font-semibold text-[#667085]">
            Student account? <Link href="/login" className="font-extrabold text-[#172a69]">Student login</Link>
          </p>
          <p className="mt-2 text-center text-xs font-semibold text-[#98a2b3]">
            <ShieldCheck size={12} className="mr-1 inline" /> Credentials admin panel se set hote hain.
          </p>
        </div>
      </section>
    </main>
  );
}
