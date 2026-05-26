import { Clock, Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";

const contactCards = [
  {
    icon: Phone,
    title: "Call Counsellor",
    text: "+91 98765 43210",
    sub: "Mon-Sat, 9:00 AM to 8:00 PM",
  },
  {
    icon: Mail,
    title: "Email Support",
    text: "admissions@krlogics.com",
    sub: "Response within 24 hours",
  },
  {
    icon: MapPin,
    title: "Visit Center",
    text: "KR Logics Institute, Jodhpur",
    sub: "Near City Mall, Rajasthan",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Help",
    text: "+91 87654 32109",
    sub: "Quick course guidance",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fc] text-slate-950">
      <PublicHeader active="contact" />

      <section className="border-b border-slate-200 bg-white px-8 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-[0.9fr_1.1fr] gap-12">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-[#fff9e0] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b78600]">
              Contact Us
            </div>
            <h1 className="font-rajdhani text-6xl font-bold leading-[0.95] text-[#1b2e6b]">
              Talk To KR Logics Counselling Team
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
              Need help choosing the right course, mock test package, or exam plan? Share your details and our team will guide you with the best path.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {contactCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-xl border border-slate-200 bg-[#f8f9fc] p-4">
                    <Icon className="mb-3 size-6 text-[#1b2e6b]" />
                    <div className="font-rajdhani text-xl font-bold text-[#1b2e6b]">{card.title}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-800">{card.text}</div>
                    <div className="mt-1 text-xs text-slate-500">{card.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <form className="rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-900/10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-rajdhani text-3xl font-bold text-[#1b2e6b]">Send Enquiry</h2>
                <p className="text-sm text-slate-500">Fill the form and get a callback.</p>
              </div>
              <div className="grid size-12 place-items-center rounded-xl bg-[#fff9e0] text-[#1b2e6b]">
                <Send className="size-6" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Full Name</span>
                <input className="h-12 w-full rounded-lg border border-slate-200 bg-[#f8f9fc] px-4 text-sm text-slate-900 outline-none transition focus:border-[#1b2e6b] focus:bg-white" placeholder="Your full name" />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Phone Number</span>
                <input className="h-12 w-full rounded-lg border border-slate-200 bg-[#f8f9fc] px-4 text-sm text-slate-900 outline-none transition focus:border-[#1b2e6b] focus:bg-white" placeholder="+91 XXXXX XXXXX" />
              </label>
            </div>

            <label className="mt-4 block space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Email Address</span>
              <input className="h-12 w-full rounded-lg border border-slate-200 bg-[#f8f9fc] px-4 text-sm text-slate-900 outline-none transition focus:border-[#1b2e6b] focus:bg-white" placeholder="your@email.com" />
            </label>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Interested In</span>
                <select className="h-12 w-full rounded-lg border border-slate-200 bg-[#f8f9fc] px-4 text-sm text-slate-900 outline-none transition focus:border-[#1b2e6b] focus:bg-white">
                  <option>Select course</option>
                  <option>IBPS PO Complete Course</option>
                  <option>SBI PO / Clerk Course</option>
                  <option>RBI Grade B Preparation</option>
                  <option>Mock Tests</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Preferred Mode</span>
                <select className="h-12 w-full rounded-lg border border-slate-200 bg-[#f8f9fc] px-4 text-sm text-slate-900 outline-none transition focus:border-[#1b2e6b] focus:bg-white">
                  <option>Online Classes</option>
                  <option>Offline Classes</option>
                  <option>Recorded Course</option>
                  <option>Only Mock Tests</option>
                </select>
              </label>
            </div>

            <label className="mt-4 block space-y-2">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Message</span>
              <textarea className="h-32 w-full resize-none rounded-lg border border-slate-200 bg-[#f8f9fc] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1b2e6b] focus:bg-white" placeholder="Tell us your target exam and preparation status..." />
            </label>

            <button type="button" className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1b2e6b] text-sm font-bold text-white transition hover:bg-[#0f1e4a]">
              <Send className="size-4" />
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section className="px-8 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-5">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <Clock className="mb-4 size-8 text-[#1b2e6b]" />
            <h3 className="font-rajdhani text-2xl font-bold text-[#1b2e6b]">Working Hours</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Monday to Saturday: 9:00 AM to 8:00 PM<br />Sunday: 10:00 AM to 4:00 PM</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ShieldCheck className="mb-4 size-8 text-[#1b2e6b]" />
            <h3 className="font-rajdhani text-2xl font-bold text-[#1b2e6b]">Admission Help</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Our team helps students compare courses, mock tests, batches and subscription plans.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-[#1b2e6b] p-6 text-white">
            <MessageCircle className="mb-4 size-8 text-[#f5c518]" />
            <h3 className="font-rajdhani text-2xl font-bold">Fastest Response</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">For urgent queries, WhatsApp support is the fastest way to connect with counsellors.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
