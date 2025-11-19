export const dynamic = "force-dynamic";
export const revalidate = 0;


import CategoryList from "@/components/frontend/CategoryList";
import CommunityTrainings from "@/components/frontend/CommunityTrainings";
import Hero from "@/components/frontend/Hero";
import MarketList from "@/components/frontend/MarketList";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function Home() {
  // Fetch categories safely
  const categoriesRes = await getData("categories");

  // Normalize data (extract array safely)
  const categoriesArray = Array.isArray(categoriesRes?.data)
    ? categoriesRes.data
    : Array.isArray(categoriesRes)
    ? categoriesRes
    : [];

  // Filter categories safely
  const categories = categoriesArray.filter(
    (category) => category?.products?.length > 3
  );

  // Fetch trainings
  const trainingsRes = await getData("trainings");

  // Normalize trainings data
  const trainings = Array.isArray(trainingsRes?.data)
    ? trainingsRes.data
    : Array.isArray(trainingsRes)
    ? trainingsRes
    : [];

  // Auth session
  const session = await getServerSession(authOptions);
  console.log(session?.user);

  return (
    <div className="min-h-screen">
      <Hero />
      <MarketList />

      {categories.map((category, i) => (
        <div className="py-8" key={i}>
          <CategoryList isMarketPage={false} category={category} />
        </div>
      ))}

      <CommunityTrainings
        title="Featured Trainings"
        trainings={trainings.slice(0, 3)}
      />
    </div>
  );
}

