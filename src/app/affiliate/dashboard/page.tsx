"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import {
  AffiliateDashboardResponse,
  getAffiliateSession,
  logoutAffiliate,
} from "@/lib/affiliate";
import { publicBackendBaseUrl } from "@/lib/mock-tests";
import { Gift, LogOut, Users } from "lucide-react";

export default function AffiliateDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(getAffiliateSession());
  const [dashboard, setDashboard] = useState<AffiliateDashboardResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const affiliateSession = getAffiliateSession();
    if (!affiliateSession) {
      router.replace("/affiliate/login");
      return;
    }

    setSession(affiliateSession);

    fetch(`${publicBackendBaseUrl}/api/affiliate/dashboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: affiliateSession.email }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({})) as AffiliateDashboardResponse & { message?: string };
        if (!response.ok) {
          throw new Error(data.message || "Dashboard load failed.");
        }
        setDashboard(data);
      })
      .catch((dashboardError) => {
        setError(dashboardError instanceof Error ? dashboardError.message : "Dashboard load failed.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    logoutAffiliate();
    router.push("/affiliate/login");
  };

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <PublicHeader />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f0a500]">Affiliate Dashboard</p>
            <h1 className="mt-2 text-2xl font-black text-[#050808]">{session.name}</h1>
            <p className="mt-1 text-sm font-semibold text-[#667085]">{session.email}</p>
          </div>
          <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-2xl border border-[#dfe5ef] bg-white px-4 py-3 text-sm font-extrabold text-[#344054]">
            <LogOut size={16} /> Logout
          </button>
        </div>

        {loading && <p className="mt-8 text-sm font-semibold text-[#667085]">Loading dashboard...</p>}
        {error && <p className="mt-8 rounded-2xl bg-[#fff8d6] px-4 py-3 text-sm font-bold text-[#7a5b00]">{error}</p>}

        {dashboard && (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[#ead694] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-[#172a69]">
                  <Gift size={20} />
                  <span className="text-sm font-extrabold uppercase tracking-[0.16em]">Referral Codes</span>
                </div>
                <p className="mt-4 text-4xl font-black text-[#050808]">{dashboard.stats.total_codes}</p>
              </div>
              <div className="rounded-[24px] border border-[#ead694] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-[#172a69]">
                  <Users size={20} />
                  <span className="text-sm font-extrabold uppercase tracking-[0.16em]">Referred Students</span>
                </div>
                <p className="mt-4 text-4xl font-black text-[#050808]">{dashboard.stats.total_students}</p>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[24px] border border-[#ead694] bg-white shadow-sm">
              <div className="border-b border-[#f2f4f7] px-6 py-4">
                <h2 className="text-lg font-black text-[#050808]">Your Referral Codes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f8fafc] text-xs font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                    <tr>
                      <th className="px-6 py-3">Code</th>
                      <th className="px-6 py-3">Discount</th>
                      <th className="px-6 py-3">Usage</th>
                      <th className="px-6 py-3">Students</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.codes.map((code) => (
                      <tr key={code.id} className="border-t border-[#f2f4f7]">
                        <td className="px-6 py-4 font-black text-[#050808]">{code.code}</td>
                        <td className="px-6 py-4 font-semibold">{code.discount_label}</td>
                        <td className="px-6 py-4">{code.used_count} / {code.usage_limit ?? "Unlimited"}</td>
                        <td className="px-6 py-4">{code.students_count}</td>
                        <td className="px-6 py-4 capitalize">{code.status}</td>
                      </tr>
                    ))}
                    {dashboard.codes.length === 0 && (
                      <tr><td className="px-6 py-6 text-[#667085]" colSpan={5}>Abhi koi referral code assign nahi hai. Admin se code generate karwayein.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-[24px] border border-[#ead694] bg-white shadow-sm">
              <div className="border-b border-[#f2f4f7] px-6 py-4">
                <h2 className="text-lg font-black text-[#050808]">Students via Your Codes</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f8fafc] text-xs font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Mobile</th>
                      <th className="px-6 py-3">State</th>
                      <th className="px-6 py-3">Code</th>
                      <th className="px-6 py-3">Discount</th>
                      <th className="px-6 py-3">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.students.map((student) => (
                      <tr key={student.id} className="border-t border-[#f2f4f7]">
                        <td className="px-6 py-4 font-bold">{student.name}</td>
                        <td className="px-6 py-4">{student.email}</td>
                        <td className="px-6 py-4">{student.mobile || "-"}</td>
                        <td className="px-6 py-4">{student.state || "-"}</td>
                        <td className="px-6 py-4 font-black">{student.referral_code}</td>
                        <td className="px-6 py-4">{student.discount_label}</td>
                        <td className="px-6 py-4">{student.registered_at ? new Date(student.registered_at).toLocaleDateString("en-IN") : "-"}</td>
                      </tr>
                    ))}
                    {dashboard.students.length === 0 && (
                      <tr><td className="px-6 py-6 text-[#667085]" colSpan={7}>Abhi koi student aapke code se register nahi hua.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <p className="mt-8 text-center text-sm font-semibold text-[#667085]">
          Student account ke liye <Link href="/login" className="font-extrabold text-[#172a69]">student login</Link> use karein.
        </p>
      </section>
    </main>
  );
}
