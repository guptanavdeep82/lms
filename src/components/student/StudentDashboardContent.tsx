"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Gift,
  Headphones,
  Loader2,
  Megaphone,
  PlayCircle,
  Send,
  Share2,
  User,
} from "lucide-react";
import { PurchasedCoursesList } from "@/components/student/PurchasedCoursesList";
import { formatInr } from "@/lib/packages";
import { getStudentSession, loginStudent, saveStudentProfile } from "@/lib/student-auth";
import { fetchStates, type StateOption } from "@/lib/student-registration";
import {
  createSupportTicket,
  fetchReferEarn,
  fetchStudentLibraryData,
  fetchStudentProfile,
  fetchSupportTickets,
  fetchTestAttempts,
  updateStudentProfile,
  type MockTestAttemptRecord,
  type ReferEarnData,
  type StudentProfileResponse,
  type SupportTicketRecord,
} from "@/lib/student-dashboard";
import type { StudentLibraryResponse } from "@/lib/packages";

const tickerMessages = [
  "New SBI PO full mock test is live now",
  "Reasoning live class starts today at 7:00 PM",
  "Your Quant assignment deadline is tomorrow",
  "RBI Grade B current affairs PDF has been added",
];

function SectionCard({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f0a500]">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#172a69]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function StudentDashboardContent() {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<StudentProfileResponse | null>(null);
  const [library, setLibrary] = useState<StudentLibraryResponse | null>(null);
  const [states, setStates] = useState<StateOption[]>([]);
  const [dailyAttempts, setDailyAttempts] = useState<MockTestAttemptRecord[]>([]);
  const [mockAttempts, setMockAttempts] = useState<MockTestAttemptRecord[]>([]);
  const [referEarn, setReferEarn] = useState<ReferEarnData | null>(null);
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);
  const [resultTab, setResultTab] = useState<"daily_practice" | "mock_test">("mock_test");
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: "", mobile: "", state_id: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: "", category: "general", message: "" });
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSaving, setTicketSaving] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const displayName = profile?.name || "Student";
  const metrics = useMemo(() => ({
    courses: library?.stats.courses_count ?? 0,
    tests: dailyAttempts.length + mockAttempts.length,
    orders: library?.stats.orders_count ?? 0,
  }), [library, dailyAttempts.length, mockAttempts.length]);

  useEffect(() => {
    const session = getStudentSession();
    if (!session?.email) {
      setLoading(false);
      return;
    }

    setEmail(session.email);
    setProfileForm({
      name: session.name,
      mobile: session.mobile || "",
      state_id: session.stateId ? String(session.stateId) : "",
    });

    Promise.all([
      fetchStudentProfile(session.email),
      fetchStudentLibraryData(session.email),
      fetchTestAttempts(session.email, "daily_practice"),
      fetchTestAttempts(session.email, "mock_test"),
      fetchReferEarn(session.email),
      fetchSupportTickets(session.email),
      fetchStates(),
    ]).then(([profileData, libraryData, daily, mock, refer, ticketList, stateList]) => {
      if (profileData) {
        setProfile(profileData);
        setProfileForm({
          name: profileData.name,
          mobile: profileData.mobile || "",
          state_id: profileData.state?.id ? String(profileData.state.id) : "",
        });
      }
      setLibrary(libraryData);
      setDailyAttempts(daily);
      setMockAttempts(mock);
      setReferEarn(refer);
      setTickets(ticketList);
      setStates(stateList);
    }).finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setProfileSaving(true);
    setProfileMessage("");
    try {
      const updated = await updateStudentProfile({
        email,
        name: profileForm.name.trim(),
        mobile: profileForm.mobile.trim() || undefined,
        state_id: profileForm.state_id ? Number(profileForm.state_id) : undefined,
      });
      if (updated) {
        setProfile(updated);
        saveStudentProfile({
          name: updated.name,
          email: updated.email,
          mobile: updated.mobile || undefined,
          stateId: updated.state?.id,
          stateName: updated.state?.name,
        });
        loginStudent({
          email: updated.email,
          name: updated.name,
          mobile: updated.mobile || undefined,
          stateId: updated.state?.id,
          stateName: updated.state?.name,
        });
      }
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleTicketSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setTicketSaving(true);
    setTicketMessage("");
    try {
      const ticket = await createSupportTicket({
        email,
        subject: ticketForm.subject.trim(),
        category: ticketForm.category,
        message: ticketForm.message.trim(),
      });
      if (ticket) setTickets((current) => [ticket, ...current]);
      setTicketForm({ subject: "", category: "general", message: "" });
      setTicketMessage("Ticket raised successfully.");
    } catch (error) {
      setTicketMessage(error instanceof Error ? error.message : "Unable to raise ticket.");
    } finally {
      setTicketSaving(false);
    }
  };

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage(`${label} copied`);
      window.setTimeout(() => setCopyMessage(""), 2000);
    } catch {
      setCopyMessage("Copy failed");
    }
  };

  const activeAttempts = resultTab === "daily_practice" ? dailyAttempts : mockAttempts;

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="animate-spin text-[#172a69]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[22px] border border-[#dfe5ef] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3 border-b border-[#edf1f7] bg-[#172a69] px-5 py-3 text-white">
          <Megaphone size={18} className="text-[#f5c518]" />
          <div className="relative flex-1 overflow-hidden whitespace-nowrap">
            <div className="inline-flex min-w-max gap-10 text-sm font-semibold" style={{ animation: "krTicker 26s linear infinite" }}>
              {[...tickerMessages, ...tickerMessages].map((message, index) => (
                <span key={`${message}-${index}`} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f5c518]" />
                  {message}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`@keyframes krTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="relative overflow-hidden rounded-[28px] bg-[#172a69] p-6 text-white shadow-[0_22px_60px_rgba(23,42,105,0.22)] sm:p-8">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f5c518]/18" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#f7d85a] ring-1 ring-white/15">
              <CheckCircle2 size={14} /> Active Student
            </span>
            <h1 className="mt-5 text-[28px] font-extrabold leading-tight tracking-[-0.04em] sm:text-[36px]">
              Welcome back, {displayName.split(" ")[0]}
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/72">
              Today&apos;s goal: complete 2 classes, attempt one mini mock, and finish your current affairs revision.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#courses" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#f5c518] px-5 text-sm font-extrabold text-[#172a69] shadow-lg shadow-black/10 transition hover:bg-[#ffd844]">
                Continue Learning <ArrowRight size={17} />
              </a>
              <Link href="/student/mock-tests" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white/10 px-5 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15">
                Start Mock Test <PlayCircle size={17} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {[
            ["Courses", metrics.courses],
            ["Tests Taken", metrics.tests],
            ["Orders", metrics.orders],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-[22px] border border-[#dfe5ef] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-[#7d8799]">{label}</p>
              <p className="mt-2 text-3xl font-extrabold text-[#172a69]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <SectionCard id="profile" eyebrow="Account" title="My Profile">
        <form onSubmit={handleProfileSave} className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#667085]">Full Name</span>
            <input className="h-12 w-full rounded-2xl border border-[#dfe5ef] px-4" value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} required />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#667085]">Email</span>
            <input className="h-12 w-full rounded-2xl border border-[#dfe5ef] bg-[#f8fafc] px-4 text-[#667085]" value={email} readOnly />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#667085]">Mobile</span>
            <input className="h-12 w-full rounded-2xl border border-[#dfe5ef] px-4" value={profileForm.mobile} onChange={(e) => setProfileForm((f) => ({ ...f, mobile: e.target.value }))} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#667085]">State</span>
            <select className="h-12 w-full rounded-2xl border border-[#dfe5ef] px-4" value={profileForm.state_id} onChange={(e) => setProfileForm((f) => ({ ...f, state_id: e.target.value }))}>
              <option value="">Select state</option>
              {states.map((state) => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
          </label>
          {profile?.custom_discount_percent ? (
            <p className="md:col-span-2 rounded-2xl bg-[#eef2ff] px-4 py-3 text-sm font-semibold text-[#172a69]">
              Your admin discount: {profile.custom_discount_percent}% on eligible purchases.
            </p>
          ) : null}
          <div className="md:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={profileSaving} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#172a69] px-5 text-sm font-extrabold text-white disabled:opacity-60">
              {profileSaving ? <Loader2 className="animate-spin" size={16} /> : <User size={16} />}
              Save Profile
            </button>
            {profileMessage ? <span className="text-sm font-semibold text-[#0f9f78]">{profileMessage}</span> : null}
          </div>
        </form>
      </SectionCard>

      <SectionCard id="test-results" eyebrow="Performance" title="Recent Test Results">
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            ["mock_test", "Mock Test"],
            ["daily_practice", "Daily Practice Test"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setResultTab(value as "daily_practice" | "mock_test")}
              className={`rounded-full px-4 py-2 text-sm font-bold ${resultTab === value ? "bg-[#172a69] text-white" : "bg-[#f3f6fb] text-[#334155]"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#edf1f7] text-[#7d8799]">
                <th className="px-3 py-3">Test</th>
                <th className="px-3 py-3">Score</th>
                <th className="px-3 py-3">Correct</th>
                <th className="px-3 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {activeAttempts.length ? activeAttempts.map((attempt) => (
                <tr key={attempt.id} className="border-b border-[#f3f6fb]">
                  <td className="px-3 py-3 font-semibold text-[#111827]">{attempt.test_title}</td>
                  <td className="px-3 py-3">{attempt.score}</td>
                  <td className="px-3 py-3">{attempt.correct_count}/{attempt.total_questions}</td>
                  <td className="px-3 py-3 text-[#7d8799]">{attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : "-"}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-3 py-8 text-center text-[#667085]">No test results yet. Attempt a mock test to see your scores here.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard id="courses" eyebrow="Learning" title="My Courses">
        <PurchasedCoursesList />
      </SectionCard>

      <SectionCard id="purchases" eyebrow="Billing" title="Purchase History">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#edf1f7] text-[#7d8799]">
                <th className="px-3 py-3">Item Type</th>
                <th className="px-3 py-3">Item ID</th>
                <th className="px-3 py-3">Purchased On</th>
                <th className="px-3 py-3">Expires</th>
              </tr>
            </thead>
            <tbody>
              {library?.purchases?.length ? library.purchases.map((purchase) => (
                <tr key={purchase.id} className="border-b border-[#f3f6fb]">
                  <td className="px-3 py-3 font-semibold capitalize">{purchase.purchasable_type.replace("_", " ")}</td>
                  <td className="px-3 py-3">#{purchase.purchasable_id}</td>
                  <td className="px-3 py-3">{purchase.created_at ? new Date(purchase.created_at).toLocaleDateString() : "-"}</td>
                  <td className="px-3 py-3">{purchase.expires_at ? new Date(purchase.expires_at).toLocaleDateString() : "Lifetime"}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-3 py-8 text-center text-[#667085]">No purchases found yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard id="orders" eyebrow="Billing" title="Order History">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#edf1f7] text-[#7d8799]">
                <th className="px-3 py-3">Order</th>
                <th className="px-3 py-3">Item</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Paid At</th>
              </tr>
            </thead>
            <tbody>
              {library?.orders?.length ? library.orders.map((order) => (
                <tr key={order.id} className="border-b border-[#f3f6fb]">
                  <td className="px-3 py-3 font-semibold">#{order.id}</td>
                  <td className="px-3 py-3">{order.item_title}</td>
                  <td className="px-3 py-3">{formatInr(order.final_amount)}</td>
                  <td className="px-3 py-3 capitalize">{order.status}</td>
                  <td className="px-3 py-3">{order.paid_at ? new Date(order.paid_at).toLocaleString() : "-"}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-[#667085]">No orders found yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <section id="refer-earn" className="scroll-mt-24 overflow-hidden rounded-[28px] border border-[#dfe5ef] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#6d5dfc]">Refer & Earn</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#172a69]">Learn & Grow As One! Refer & Earn Exciting Discounts!</h2>
            <p className="mt-3 text-sm leading-7 text-[#667085]">
              Introduce your friends to KR Logics. Share your referral code and help them purchase on our platform. Rewards are assured for every transaction made using your invite code.
            </p>

            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#667085]">Your Invite Link</span>
                <div className="flex gap-2">
                  <input readOnly className="h-12 flex-1 rounded-2xl border border-[#dfe5ef] px-4 text-sm" value={referEarn?.invite_link || ""} />
                  <button type="button" onClick={() => copyText(referEarn?.invite_link || "", "Invite link")} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#6d5dfc] px-4 text-sm font-bold text-white">
                    <Copy size={16} /> Copy
                  </button>
                </div>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#667085]">Your Invite Code</span>
                <div className="flex gap-2">
                  <input readOnly className="h-12 flex-1 rounded-2xl border border-[#dfe5ef] px-4 text-sm font-extrabold tracking-[0.2em]" value={referEarn?.invite_code || ""} />
                  <button type="button" onClick={() => copyText(referEarn?.invite_code || "", "Invite code")} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#6d5dfc] px-4 text-sm font-bold text-white">
                    <Copy size={16} /> Copy
                  </button>
                </div>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef2ff] text-[#6d5dfc]"><Share2 size={16} /></button>
              <button type="button" className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef2ff] text-[#6d5dfc]"><Gift size={16} /></button>
            </div>

            {copyMessage ? <p className="mt-3 text-sm font-semibold text-[#0f9f78]">{copyMessage}</p> : null}
          </div>

          <div className="bg-gradient-to-br from-[#eef2ff] via-[#f8f5ff] to-[#fff8dc] p-6 sm:p-8">
            <div className="grid gap-4">
              <div className="rounded-[22px] bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-[#7d8799]">Your Earned Till Now</p>
                <p className="mt-2 text-3xl font-extrabold text-[#172a69]">{formatInr(referEarn?.earned_amount || 0)}</p>
              </div>
              <div className="rounded-[22px] bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-[#7d8799]">Peers Accepted Your Referral Invite</p>
                <p className="mt-2 text-3xl font-extrabold text-[#172a69]">{referEarn?.referrals_count || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#edf1f7] bg-[#f8fafc] p-6 sm:p-8">
          <h3 className="text-lg font-extrabold text-[#172a69]">How Refer & Earn Works</h3>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-[#667085]">
            {(referEarn?.instructions || []).map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#172a69] text-xs font-extrabold text-white">{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SectionCard id="drs-ticket" eyebrow="Support" title="DRS Ticket">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={handleTicketSubmit} className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#667085]">Subject</span>
              <input className="h-12 w-full rounded-2xl border border-[#dfe5ef] px-4" value={ticketForm.subject} onChange={(e) => setTicketForm((f) => ({ ...f, subject: e.target.value }))} required />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#667085]">Category</span>
              <select className="h-12 w-full rounded-2xl border border-[#dfe5ef] px-4" value={ticketForm.category} onChange={(e) => setTicketForm((f) => ({ ...f, category: e.target.value }))}>
                <option value="general">General</option>
                <option value="doubt">Doubt</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#667085]">Message</span>
              <textarea className="min-h-[140px] w-full rounded-2xl border border-[#dfe5ef] px-4 py-3" value={ticketForm.message} onChange={(e) => setTicketForm((f) => ({ ...f, message: e.target.value }))} required />
            </label>
            <button type="submit" disabled={ticketSaving} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#172a69] px-5 text-sm font-extrabold text-white disabled:opacity-60">
              {ticketSaving ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Raise Ticket
            </button>
            {ticketMessage ? <p className="text-sm font-semibold text-[#0f9f78]">{ticketMessage}</p> : null}
          </form>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <Headphones size={18} className="text-[#172a69]" />
              <h3 className="text-lg font-extrabold text-[#172a69]">Your Tickets</h3>
            </div>
            <div className="space-y-3">
              {tickets.length ? tickets.map((ticket) => (
                <article key={ticket.id} className="rounded-2xl border border-[#edf1f7] bg-[#f8fafc] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6d5dfc]">{ticket.ticket_no}</p>
                      <h4 className="mt-1 font-extrabold text-[#111827]">{ticket.subject}</h4>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-[#172a69]">{ticket.status.replace("_", " ")}</span>
                  </div>
                  <p className="mt-2 text-sm text-[#667085]">{ticket.message}</p>
                  {ticket.admin_reply ? (
                    <div className="mt-3 rounded-xl bg-white p-3 text-sm text-[#334155]">
                      <strong>Admin Reply:</strong> {ticket.admin_reply}
                    </div>
                  ) : null}
                </article>
              )) : (
                <p className="rounded-2xl border border-dashed border-[#dfe5ef] p-6 text-sm text-[#667085]">No tickets raised yet.</p>
              )}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
