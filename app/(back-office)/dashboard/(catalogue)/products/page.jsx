export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { columns } from "./columns";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { role, id: userId } = session.user;
  let allProducts = [];

  try {
    if (role === "ADMIN") {
      allProducts = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true, farmer: true },
      });
    } else {
      const farmers = await prisma.farmer.findMany({
        where: { userId },
        select: { id: true },
      });
      const farmerIds = farmers.map(f => f.id);

      allProducts = await prisma.product.findMany({
        where: { farmerId: { in: farmerIds } },
        orderBy: { createdAt: "desc" },
        include: { category: true, farmer: true },
      });
    }

    // Serialize ObjectIds and Dates
    allProducts = allProducts.map(p => ({
      ...p,
      id: p.id.toString(),
      categoryId: p.categoryId?.toString() || null,
      farmerId: p.farmerId?.toString() || null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      category: p.category ? {
        ...p.category,
        id: p.category.id.toString(),
        createdAt: p.category.createdAt.toISOString(),
        updatedAt: p.category.updatedAt.toISOString(),
      } : null,
      farmer: p.farmer ? {
        ...p.farmer,
        id: p.farmer.id.toString(),
        createdAt: p.farmer.createdAt.toISOString(),
        updatedAt: p.farmer.updatedAt.toISOString(),
      } : null
    }));

  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch products: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="Products"
        href="/dashboard/products/new"
        linkTitle="Add Product"
      />
      <div className="py-8">
        <DataTable data={allProducts} columns={columns} />
      </div>
    </div>
  );
}
