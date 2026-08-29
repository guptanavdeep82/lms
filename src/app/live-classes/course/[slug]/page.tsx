import View from "./view";
import { liveCourseSlugs } from "@/lib/static-export-params";

export async function generateStaticParams() {
  const slugs = await liveCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function Page() {
  return <View />;
}
