"use client";

import { useEffect, useState } from "react";
import { fetchStudentLibrary } from "@/lib/packages";
import { getStudentSession } from "@/lib/student-auth";

export function StudentPurchasesPanel() {
  const [orders, setOrders] = useState<Array<{ id: number; item_title: string; item_type: string; final_amount: number; paid_at: string | null }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStudentSession();
    if (!session?.email) {
      setLoading(false);
      return;
    }

    fetchStudentLibrary(session.email)
      .then((library) => setOrders(library?.orders || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div id="purchases" className="rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#172a69]">My Purchases</h2>
      {loading ? (
        <p className="mt-4 text-sm font-semibold text-[#667085]">Loading purchases...</p>
      ) : !orders.length ? (
        <p className="mt-4 text-sm font-semibold text-[#667085]">No payment history yet.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-3 rounded-2xl bg-[#f7f9fd] p-4">
              <div>
                <p className="text-sm font-extrabold text-[#111827]">{order.item_title}</p>
                <p className="mt-1 text-xs font-semibold text-[#7d8799]">{order.item_type.replace("_", " ")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-[#172a69]">₹{order.final_amount.toLocaleString("en-IN")}</p>
                <p className="mt-1 text-xs font-semibold text-[#7d8799]">{order.paid_at ? new Date(order.paid_at).toLocaleDateString("en-IN") : "-"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
