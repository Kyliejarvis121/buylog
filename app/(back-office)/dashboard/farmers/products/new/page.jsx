import ProductUpload from "@/components/backoffice/Farmer/ProductUpload";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <p>Please login to upload a product</p>;

  const userId = session.user.id;

  // Fetch categories for the dropdown
  let categories = [];
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }

  // Transform categories into { value, label } format for SelectInput
  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.title,
  }));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-6">Upload New Product</h1>
      <ProductUpload farmerId={userId} categories={categoryOptions} />
    </div>
  );
}
