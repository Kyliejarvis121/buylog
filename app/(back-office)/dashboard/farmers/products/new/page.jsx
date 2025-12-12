import ProductUpload from "@/components/backoffice/Farmer/ProductUpload";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Get the farmer linked to the logged-in user
  const farmer = await prisma.farmer.findFirst({
    where: { userId: session.user.id },
  });

  if (!farmer) {
    console.error("Farmer record not found for user", session.user.id);
    redirect("/dashboard"); // Or show a message
  }

  // Fetch categories
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
      <ProductUpload farmerId={farmer.id} categories={categories} />
    </div>
  );
}
