"use client";


import PageHeader from "@/components/backoffice/PageHeader";
import columns from "./columns";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return <p>Please login to view your products</p>;

  const farmer = await prisma.farmer.findFirst({
    where: { userId: session.user.id },
  });

  const farmerProducts = farmer
    ? await prisma.product.findMany({
        where: { farmerId: farmer.id },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="My Products"
        href="/dashboard/farmers/products/new"
        linkTitle="Add Product"
      />

      <div className="py-8">
        {farmerProducts.length === 0 ? (
          <p className="text-gray-600">You haven’t uploaded any products yet.</p>
        ) : (
          <FarmerProductsTable products={farmerProducts} />
        )}
      </div>
    </div>
  );
}
