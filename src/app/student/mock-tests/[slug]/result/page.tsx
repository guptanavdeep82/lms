import View from "./view";
import { mockTestSlugs } from "@/lib/static-export-params";

export async function generateStaticParams() {
  const slugs = await mockTestSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function Page() {
  return <View />;
}
