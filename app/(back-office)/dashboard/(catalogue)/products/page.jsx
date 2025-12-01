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
      // Admin sees all products
      allProducts = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true },
      });
    } else {
      // Farmer: get all their farmer IDs first
      const farmers = await prisma.farmer.findMany({
        where: { userId },
        select: { id: true },
      });
      const farmerIds = farmers.map(f => f.id);

      // Fetch only products for these farmer IDs
      allProducts = await prisma.product.findMany({
        where: { farmerId: { in: farmerIds } },
        orderBy: { createdAt: "desc" },
        include: { category: true },
      });
    }
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
