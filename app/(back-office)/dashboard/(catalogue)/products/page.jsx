export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import { prisma } from "@/lib/prismadb"; // server-only prisma
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = session.user.role;
  const userId = session.user.id;

  let products = [];

  try {
    if (role === "ADMIN") {
      products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          farmer: {
            include: { user: true }, // optional: include farmer's user info
          },
        },
      });
    } else if (role === "FARMER") {
      products = await prisma.product.findMany({
        where: { farmerId: userId }, // must use farmerId
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

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="Products"
        href="/dashboard/products/new"
        linkTitle="Add Product"
      />
      <div className="py-8">
        <DataTable data={products} columns={columns} />
      </div>
    </div>
  );
}
