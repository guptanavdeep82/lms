import View from "./view";
import { cmsPageSlugs } from "@/lib/static-export-params";

export async function generateStaticParams() {
  const slugs = await cmsPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function Page() {
  return <View />;
}
