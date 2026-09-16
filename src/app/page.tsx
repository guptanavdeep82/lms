import { fetchHomePageData } from "@/lib/home-page";
import { HomePageView } from "./home-page-view";

export const revalidate = 120;

export default async function HomePage() {
  const homeData = await fetchHomePageData();
  return <HomePageView initialData={homeData} />;
}
