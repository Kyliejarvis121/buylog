export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { prisma } from "@/lib/prismadb";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function NewProduct() {
  // Protect route
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  let categories = [];
  let farmers = [];

  try {
    // Fetch categories
    const categoriesData = await prisma.categories.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });

    // Fetch only farmer users
    const usersData = await prisma.users.findMany({
      where: { role: "FARMER" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    categories = categoriesData;
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
