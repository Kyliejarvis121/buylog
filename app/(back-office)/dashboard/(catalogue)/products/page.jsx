export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { columns } from "./columns";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <p className="p-4 text-red-600">Unauthorized</p>;
  }

  const role = session.user.role;
  const userId = session.user.id;

  let allProducts = [];

  try {
    allProducts = await prisma.products.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch products: {error?.message || "Unknown error"}
      </div>
    );
  }

  // Filter products for non-admins
  const farmerProducts = role === "ADMIN" ? allProducts : allProducts.filter((p) => p.userId === userId);

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="Products"
        href="/dashboard/products/new"
        linkTitle="Add Product"
      />

      <div className="py-8">
        <DataTable data={farmerProducts} columns={columns} />
      </div>
    </div>
  );
}
