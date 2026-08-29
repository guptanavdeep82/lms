import View from "./view";
import { mockCategorySlugs } from "@/lib/static-export-params";

export async function generateStaticParams() {
  const slugs = await mockCategorySlugs();
  return slugs.map((category) => ({ category }));
}

export default function Page() {
  return <View />;
}
