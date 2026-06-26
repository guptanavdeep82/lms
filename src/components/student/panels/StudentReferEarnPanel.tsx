"use client";

import { useEffect, useState } from "react";
import { Copy, Gift, Loader2, Share2 } from "lucide-react";
import { formatInr } from "@/lib/packages";
import { fetchReferEarn, type ReferEarnData } from "@/lib/student-dashboard";
import { useStudentEmail } from "@/components/student/useStudentEmail";

export function StudentReferEarnPanel() {
  const email = useStudentEmail();
  const [referEarn, setReferEarn] = useState<ReferEarnData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    fetchReferEarn(email)
      .then(setReferEarn)
      .finally(() => setLoading(false));
  }, [email]);

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyMessage(`${label} copied`);
      window.setTimeout(() => setCopyMessage(""), 2000);
    } catch {
      setCopyMessage("Copy failed");
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="animate-spin text-[#172a69]" size={32} />
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-[#dfe5ef] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0957D3]">Refer & Earn</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#172a69]">Learn & Grow As One! Refer & Earn Exciting Discounts!</h2>
          <p className="mt-3 text-sm leading-7 text-[#667085]">
            Introduce your friends to KR Logics. Share your referral code and help them purchase on our platform. Rewards are assured for every transaction made using your invite code.
          </p>

          <div className="mt-6 grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#667085]">Your Invite Link</span>
              <div className="flex gap-2">
                <input readOnly className="h-12 flex-1 rounded-2xl border border-[#dfe5ef] px-4 text-sm" value={referEarn?.invite_link || ""} />
                <button type="button" onClick={() => copyText(referEarn?.invite_link || "", "Invite link")} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#0957D3] px-4 text-sm font-bold text-white">
                  <Copy size={16} /> Copy
                </button>
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#667085]">Your Invite Code</span>
              <div className="flex gap-2">
                <input readOnly className="h-12 flex-1 rounded-2xl border border-[#dfe5ef] px-4 text-sm font-extrabold tracking-[0.2em]" value={referEarn?.invite_code || ""} />
                <button type="button" onClick={() => copyText(referEarn?.invite_code || "", "Invite code")} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#0957D3] px-4 text-sm font-bold text-white">
                  <Copy size={16} /> Copy
                </button>
              </div>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef2ff] text-[#0957D3]"><Share2 size={16} /></button>
            <button type="button" className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef2ff] text-[#0957D3]"><Gift size={16} /></button>
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
  );
}
