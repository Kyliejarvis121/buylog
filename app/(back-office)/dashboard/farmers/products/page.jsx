"use client";


import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { columns } from "./columns";
import { prisma } from "@/lib/prismadb";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <p className="text-red-600">Please login to view your products</p>;
  }

  let farmerProducts = [];

  try {
    // 1️⃣ Get the Farmer record linked to the logged-in user
    const farmer = await prisma.farmer.findFirst({
      where: { userId: session.user.id },
    });

    if (farmer) {
      // 2️⃣ Fetch products for this farmer
      farmerProducts = await prisma.product.findMany({
        where: { farmerId: farmer.id },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    return <p className="text-red-600">Failed to load products.</p>;
  }

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
          <DataTable data={farmerProducts} columns={columns} />
        )}
      </div>
    </div>
  );
}
