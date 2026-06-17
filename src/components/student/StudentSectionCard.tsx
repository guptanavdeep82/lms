type StudentSectionCardProps = {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

export function StudentSectionCard({ id, eyebrow, title, children }: StudentSectionCardProps) {
  return (
    <section id={id} className="scroll-mt-24 rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f0a500]">{eyebrow}</p>
        <h2 className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-[#172a69]">{title}</h2>
      </div>
      {children}
    </section>
  );
}
