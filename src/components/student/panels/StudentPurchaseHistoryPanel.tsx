"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchStudentLibraryData } from "@/lib/student-dashboard";
import type { StudentLibraryResponse } from "@/lib/packages";
import { StudentSectionCard } from "@/components/student/StudentSectionCard";
import { useStudentEmail } from "@/components/student/useStudentEmail";

export function StudentPurchaseHistoryPanel() {
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
    <StudentSectionCard eyebrow="Billing" title="Purchase History">
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
    </StudentSectionCard>
  );
}
