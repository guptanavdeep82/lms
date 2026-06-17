type StudentPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function StudentPageHeader({ eyebrow, title, description }: StudentPageHeaderProps) {
  return (
    <section className="mb-6 rounded-[28px] border border-[#dfe5ef] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f0a500]">{eyebrow}</p>
      <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.04em] text-[#172a69] sm:text-[36px]">{title}</h1>
      {description ? <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#667085]">{description}</p> : null}
    </section>
  );
}
