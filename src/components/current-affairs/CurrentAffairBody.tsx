export function CurrentAffairBody({ content }: { content: string }) {
  const looksHtml = /<\/?[a-z][\s\S]*>/i.test(content);

  if (!looksHtml) {
    return <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-[#334155]">{content}</p>;
  }

  return (
    <div
      className="ca-rich-content mt-3 text-sm font-medium leading-6 text-[#334155] [&_a]:font-bold [&_a]:text-[#0957D3] [&_a]:underline [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-extrabold [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-extrabold [&_li]:mb-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 last:[&_p]:mb-0 [&_strong]:font-extrabold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
