import { prisma } from "@/lib/prismadb";
import NewMarketForm from "@/components/backoffice/NewMarketForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewMarket() {
  let categories = [];
  try {
    const categoriesData = await prisma.categories.findMany({
      orderBy: { createdAt: "desc" },
    });
    categories = categoriesData.map((category) => ({
      id: category.id,
      title: category.title,
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  return <NewMarketForm categories={categories} />;
}
