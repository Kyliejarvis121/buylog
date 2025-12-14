import FormHeader from "@/components/backoffice/FormHeader";
import ProductUpload from "@/components/backoffice/Farmer/ProductUpload";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function UpdateProductPage({ params }) {
  const { id } = params;

  // 1️⃣ Auth check
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <p className="p-4 text-red-600">
        Please login to edit this product
      </p>
    );
  }

  // 2️⃣ Find farmer linked to user
  const farmer = await prisma.farmer.findFirst({
    where: { userId: session.user.id },
  });

  if (!farmer) {
    return (
      <p className="p-4 text-red-600">
        Farmer account not found
      </p>
    );
  }

  // 3️⃣ Fetch product (ownership enforced)
  const product = await prisma.product.findFirst({
    where: {
      id,
      farmerId: farmer.id,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    return (
      <p className="p-4 text-red-600">
        Product not found or access denied
      </p>
    );
  }

  // 4️⃣ Fetch categories
  const categoriesData = await prisma.category.findMany({
    orderBy: { title: "asc" },
  });

  const categories = categoriesData.map((category) => ({
    id: category.id,
    title: category.title,
  }));

  return (
    <div className="container mx-auto py-8">
      <FormHeader title="Update Product" />

      <ProductUpload
        initialData={product}     // 🔥 IMPORTANT for edit mode
        categories={categories}
        farmerId={farmer.id}
        isUpdate={true}            // 🔥 tells form this is EDIT
      />
    </div>
  );
}

