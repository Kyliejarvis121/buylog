export default async function Home() {
  // Fetch banners
  const bannersRes = await getData("banners");
  const banners = Array.isArray(bannersRes?.data)
    ? bannersRes.data
    : Array.isArray(bannersRes)
    ? bannersRes
    : [];

  // Fetch categories
  const categoriesRes = await getData("categories");
  const categoriesArray = Array.isArray(categoriesRes?.data)
    ? categoriesRes.data
    : Array.isArray(categoriesRes)
    ? categoriesRes
    : [];

  const categories = await Promise.all(
    categoriesArray.map(async (cat) => {
      const productsRes = await getData(`products?catId=${cat.id}`);
      const products = Array.isArray(productsRes?.data)
        ? productsRes.data
        : Array.isArray(productsRes)
        ? productsRes
        : [];
      return { ...cat, products };
    })
  );

  const filteredCategories = categories.filter((c) => c.products.length > 3);

  // Fetch trainings
  const trainingsRes = await getData("trainings");
  const trainings = Array.isArray(trainingsRes?.data)
    ? trainingsRes.data
    : Array.isArray(trainingsRes)
    ? trainingsRes
    : [];

  return (
    <div className="min-h-screen">
      {/* Banners */}
      {banners.length > 0 && (
        <div className="py-4">
          <div className="flex overflow-x-auto gap-4">
            {banners.map((banner) => (
              <a key={banner.id} href={banner.link || "#"}>
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <Hero />
      <MarketList />

      {filteredCategories.map((category, i) => (
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
