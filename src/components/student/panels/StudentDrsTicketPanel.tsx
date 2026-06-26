"use client";

import { useEffect, useState } from "react";
import { Headphones, Loader2, Send } from "lucide-react";
import { createSupportTicket, fetchSupportTickets, type SupportTicketRecord } from "@/lib/student-dashboard";
import { StudentSectionCard } from "@/components/student/StudentSectionCard";
import { useStudentEmail } from "@/components/student/useStudentEmail";

export function StudentDrsTicketPanel() {
  const email = useStudentEmail();
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [ticketForm, setTicketForm] = useState({ subject: "", category: "general", message: "" });
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSaving, setTicketSaving] = useState(false);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    fetchSupportTickets(email)
      .then(setTickets)
      .finally(() => setLoading(false));
  }, [email]);

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

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="animate-spin text-[#172a69]" size={32} />
      </div>
    );
  }

  return (
    <StudentSectionCard eyebrow="Support" title="DRS Ticket">
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
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0957D3]">{ticket.ticket_no}</p>
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
    </StudentSectionCard>
  );
}
