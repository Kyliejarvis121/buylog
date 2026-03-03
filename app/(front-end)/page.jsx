import HeroCarousel from "@/components/frontend/HeroCarousel";
import MarketList from "@/components/frontend/MarketList";
import CategoryGrid from "@/components/frontend/CategoryGrid";
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

  return (
    <div className="min-h-screen">
      {/* Hero / Banners */}
      {banners.length > 0 && <HeroCarousel banners={banners} />}

      {/* Markets */}
      <MarketList markets={markets} />

      {/* Categories Grid */}
      <div className="py-6">
        <h2 className="text-lg md:text-xl font-semibold text-center mb-4">
          Browse by Category
        </h2>

        <CategoryGrid
          categories={categoriesArray.map((cat) => ({
            id: cat.id,
            name: cat.title,
            imageUrl: cat.imageUrl || null,
            slug: cat.slug || null,
          }))}
        />
      </div>
    </div>
  );
}