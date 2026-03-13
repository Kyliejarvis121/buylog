import { notFound } from "next/navigation";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FormHeader from "@/components/backoffice/FormHeader";
import ProductUpload from "@/components/backoffice/Farmer/ProductUpload";

export default async function UpdateProduct({ params: { id } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return notFound();
  }

  const farmer = await prisma.farmer.findUnique({
    where: { userId: session.user.id },
  });

  if (!farmer) {
    return notFound();
  }

  const product = await prisma.product.findFirst({
    where: {
      id,
      farmerId: farmer.id,
    },
  });

  if (!product) {
    return notFound();
  }

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <div>
      <FormHeader title="Update Product" />

      <ProductUpload
        farmerId={farmer.id}
        categories={categories}
        existingProduct={product}
      />
    </div>
  );
}