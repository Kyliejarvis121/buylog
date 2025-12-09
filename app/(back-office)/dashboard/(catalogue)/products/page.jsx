export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "../../columns";
import { prisma } from "@/lib/prismadb"; // server-only prisma
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns"; // make sure columns matches the updated schema

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = session.user.role;
  const userId = session.user.id;

  let products = [];

  try {
    if (role === "ADMIN") {
      // Admin sees all products
      products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          farmer: {
            include: { user: true }, // farmer's user info
          },
        },
      });
    } else if (role === "FARMER") {
      // Farmer sees only their products
      products = await prisma.product.findMany({
        where: { farmerId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          farmer: {
            include: { user: true },
          },
        },
      });
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return (
      <div className="p-4 text-red-600">
        Failed to load products. {error?.message || ""}
      </div>
    );
  }

  // Optional: map to match columns expected by DataTable
  const mappedProducts = products.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category?.title || "N/A",
    price: p.price || 0,
    salePrice: p.salePrice || null,
    stock: p.productStock || 0,
    isActive: p.isActive,
    farmerName: p.farmer?.name || p.farmer?.user?.name || "N/A",
  }));

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="Products"
        href="/dashboard/products/new"
        linkTitle="Add Product"
      />
      <div className="py-8">
        <DataTable data={mappedProducts} columns={columns} />
      </div>
    </div>
  );
}
