import React from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { prisma } from "@/lib/prismadb";
import { columns } from "./columns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoriesPage() {
  let categories = [];

  try {
    categories = await prisma.categories.findMany({
      orderBy: { title: "asc" },
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch categories: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        heading="Categories"
        href="/dashboard/categories/new"
        linkTitle="Add Category"
      />
      <div className="py-0">
        <DataTable data={categories} columns={columns} />
      </div>
    </div>
  );
}
