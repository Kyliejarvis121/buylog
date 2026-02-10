import HeroCarousel from "@/components/frontend/HeroCarousel";
import MarketList from "@/components/frontend/MarketList";
import CategoryGrid from "@/components/frontend/CategoryGrid";
import CommunityTrainings from "@/components/frontend/CommunityTrainings";
import { getData } from "@/lib/getData";

export default async function HomePage() {
  const bannersRes = await getData("banners");
  const banners = Array.isArray(bannersRes?.data) ? bannersRes.data : [];

  const marketsRes = await getData("markets");
  const markets = Array.isArray(marketsRes?.data) ? marketsRes.data : [];

  const categoriesRes = await getData("categories");
  const categoriesArray = Array.isArray(categoriesRes?.data)
    ? categoriesRes.data
    : [];

  const trainingsRes = await getData("trainings");
  const trainings = Array.isArray(trainingsRes?.data)
    ? trainingsRes.data
    : [];

  return (
    <div className="min-h-screen">
      {banners.length > 0 && <HeroCarousel banners={banners} />}
      <MarketList markets={markets} />

      {/* Categories only */}
      <div className="py-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Browse by Category
        </h2>

        <CategoryGrid
          categories={categoriesArray.map((cat) => ({
            id: cat.id,
            name: cat.name,
          }))}
        />
      </div>

      {trainings.length > 0 && (
        <CommunityTrainings
          title="Featured Trainings"
          trainings={trainings.slice(0, 3)}
        />
      )}
    </div>
  );
}
