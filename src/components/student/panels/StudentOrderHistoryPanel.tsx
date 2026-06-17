"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { formatInr } from "@/lib/packages";
import { fetchStudentLibraryData } from "@/lib/student-dashboard";
import type { StudentLibraryResponse } from "@/lib/packages";
import { StudentSectionCard } from "@/components/student/StudentSectionCard";
import { useStudentEmail } from "@/components/student/useStudentEmail";

export function StudentOrderHistoryPanel() {
  const email = useStudentEmail();
  const [library, setLibrary] = useState<StudentLibraryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    fetchStudentLibraryData(email)
      .then(setLibrary)
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="animate-spin text-[#172a69]" size={32} />
      </div>
    );
  }

  return (
    <StudentSectionCard eyebrow="Billing" title="Order History">
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
    </StudentSectionCard>
  );
}
