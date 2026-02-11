import HeroCarousel from "@/components/frontend/HeroCarousel";
import MarketList from "@/components/frontend/MarketList";
import CategoryGrid from "@/components/frontend/CategoryGrid";
import CommunityTrainings from "@/components/frontend/CommunityTrainings";
import { getData } from "@/lib/getData";

export default async function HomePage() {
  // Banners
  const bannersRes = await getData("banners");
  const banners = Array.isArray(bannersRes?.data) ? bannersRes.data : [];

  // Markets
  const marketsRes = await getData("markets");
  const markets = Array.isArray(marketsRes?.data) ? marketsRes.data : [];

  // Categories
  const categoriesRes = await getData("categories");
  const categoriesArray = Array.isArray(categoriesRes?.data)
    ? categoriesRes.data
    : [];

  // Trainings
  const trainingsRes = await getData("trainings");
  const trainings = Array.isArray(trainingsRes?.data)
    ? trainingsRes.data
    : [];

  return (
    <div className="min-h-screen">
      {/* Hero / Banners */}
      {banners.length > 0 && <HeroCarousel banners={banners} />}

      {/* Markets */}
      <MarketList markets={markets} />

      {/* Categories Grid (Jiji style) */}
      <div className="py-6">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-4">
          Browse by Category
        </h2>

        <CategoryGrid
          categories={categoriesArray.map((cat) => ({
            id: cat.id,
            name: cat.title,      // ✅ correct field
            slug: cat.slug,       // ✅ needed for routing
            iconKey: cat.iconKey, // ✅ needed for dynamic icons
          }))}
        />
      </div>

      {/* Trainings */}
      {trainings.length > 0 && (
        <CommunityTrainings
          title="Featured Trainings"
          trainings={trainings.slice(0, 3)}
        />
      )}
    </div>
  );
}
