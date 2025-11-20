import React from "react";
import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { prisma } from "@/lib/prismadb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewProduct() {
  let categories = [];
  let farmers = [];

  try {
    // Fetch categories and farmers from DB
    const categoriesData = await prisma.categories.findMany({
      orderBy: { title: "asc" },
    });

    const usersData = await prisma.users.findMany({
      where: { role: "FARMER" },
      orderBy: { name: "asc" },
    });

    categories = categoriesData.map((c) => ({ id: c.id, title: c.title }));
    farmers = usersData.map((f) => ({ id: f.id, title: f.name }));
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch data: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div>
      <FormHeader title="New Product" />
      <NewProductForm categories={categories} farmers={farmers} />
    </div>
  );
}
