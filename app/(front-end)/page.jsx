import HeroCarousel from "@/components/frontend/HeroCarousel";
import MarketList from "@/components/frontend/MarketList";
import CategoryGrid from "@/components/frontend/CategoryGrid";

import { getData } from "@/lib/getData";

export default async function HomePage() {
  // Fetch banners
  const bannersRes = await getData("banners");
  const banners = Array.isArray(bannersRes?.data) ? bannersRes.data : [];

  // Fetch markets
  const marketsRes = await getData("markets");
  const markets = Array.isArray(marketsRes?.data) ? marketsRes.data : [];

  // Fetch categories
  const categoriesRes = await getData("categories");
  const categoriesArray = Array.isArray(categoriesRes?.data)
    ? categoriesRes.data
    : [];

  // Fetch trainings
  const trainingsRes = await getData("trainings");
  const trainings = Array.isArray(trainingsRes?.data)
    ? trainingsRes.data
    : [];

  // Category click handler
  const handleCategoryClick = (categoryName) => {
    window.location.href = `/products?category=${categoryName}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero / Banner */}
      {banners.length > 0 && <HeroCarousel banners={banners} />}

      {/* Markets */}
      <MarketList markets={markets} />

      {/* Categories Only */}
      <div className="py-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Browse by Category
        </h2>
        <CategoryGrid
          categories={categoriesArray.map((cat) => ({
            id: cat.id,
            name: cat.name,
          }))}
          onSelectCategory={handleCategoryClick}
        />
      </div>

      
    </div>
  );
}
