import ProductUpload from "@/components/backoffice/Farmer/ProductUpload";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const userId = session.user.id;

  // Fetch categories to populate the dropdown
  let categories = [];
  try {
    categories = await prisma.category.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6 text-white">Upload New Product</h1>
      <ProductUpload farmerId={userId} categories={categories} />
    </div>
  );
}
