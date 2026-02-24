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

  // Find farmer linked to this user (unique relation)
  const farmer = await prisma.farmer.findUnique({
    where: { userId: session.user.id },
  });

  // If farmer not found, show message (no redirect)
  if (!farmer) {
    return (
      <div className="container mx-auto py-8 text-white">
        <h2 className="text-xl font-semibold mb-2">
          Farmer profile not found
        </h2>
        <p>
          Please contact support to activate your farmer account before uploading products.
        </p>
      </div>
    );
  }

  // Fetch categories safely
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