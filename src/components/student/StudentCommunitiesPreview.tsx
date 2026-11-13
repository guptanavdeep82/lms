"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessagesSquare } from "lucide-react";
import { fetchCommunities, type CommunitySummary } from "@/lib/communities";

export function StudentCommunitiesPreview() {
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);

  useEffect(() => {
    fetchCommunities()
      .then(setCommunities)
      .catch(() => setCommunities([]));
  }, []);

  if (communities.length === 0) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7d8799]">Communities</p>
          <h2 className="text-lg font-extrabold text-[#172a69]">Your course groups</h2>
        </div>
        <Link href="/student/communities" className="text-sm font-bold text-[#0957D3] hover:underline">
          Open chat
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {communities.map((community) => (
          <Link
            key={community.id}
            href={`/student/communities?group=${community.id}`}
            className="flex items-center gap-3 rounded-[22px] border border-[#dfe5ef] bg-white p-4 shadow-sm transition hover:border-[#c7d2fe]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eef2ff] text-[#172a69]">
              <MessagesSquare size={18} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-extrabold text-[#172a69]">{community.name}</span>
              <span className="mt-0.5 block truncate text-sm text-[#667085]">{community.last_message || community.course_title}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
