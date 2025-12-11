import HeroCarousel from "@/components/frontend/HeroCarousel";
import MarketList from "@/components/frontend/MarketList";
import CategoryList from "@/components/frontend/CategoryList";
import CommunityTrainings from "@/components/frontend/CommunityTrainings";
import { getData } from "@/lib/getData";

export default async function Home() {
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

  // Fetch products per category safely
  const categories = await Promise.all(
    categoriesArray.map(async (cat) => {
      const productsRes = await getData(`products?catId=${cat.id}`);
      const products = Array.isArray(productsRes?.data)
        ? productsRes.data.map((p) => ({
            ...p,
            farmer: p.farmer ?? null,
            category: p.category ?? null,
          }))
        : [];
      return { ...cat, products };
    })
  );

  const filteredCategories = categories.filter((c) => c.products.length > 3);

  // Fetch trainings
  const trainingsRes = await getData("trainings");
  const trainings = Array.isArray(trainingsRes?.data)
    ? trainingsRes.data
    : [];

  return (
    <div className="min-h-screen">
      {/* Hero / Banner */}
      {banners.length > 0 && <HeroCarousel banners={banners} />}

      {/* Markets */}
      <MarketList markets={markets} />

      {/* Categories */}
      {filteredCategories.map((category, i) => (
        <div className="py-8" key={category.id || i}>
          <CategoryList
            isMarketPage={false}
            category={{
              ...category,
              products: category.products.map((p) => ({
                ...p,
                title: p.title || "Untitled Product",
                price: p.price ?? 0,
                salePrice: p.salePrice ?? 0,
                imageUrl: p.imageUrl || "",
                farmer: p.farmer ?? { name: "Unknown Farmer" },
              })),
            }}
          />
        </div>
      ))}

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
