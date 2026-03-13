import ProductUpload from "@/components/backoffice/Farmer/ProductUpload";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // ✅ GET OR CREATE FARMER PROFILE (NO BLOCKING)
  let farmer = await prisma.farmer.findUnique({
    where: { userId: session.user.id },
  });

  if (!farmer) {
    farmer = await prisma.farmer.create({
      data: {
        userId: session.user.id,
        name: session.user.name || "Farmer",
        isActive: true,
      },
    });
  }

  // ✅ FETCH CATEGORIES (SAFE)
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
      <h1 className="text-2xl font-semibold mb-6 text-white">
        Upload New Product
      </h1>

      <ProductUpload
        farmerId={farmer.id}
        categories={categories}
        existingProduct={null}
      />
    </div>
  );
}