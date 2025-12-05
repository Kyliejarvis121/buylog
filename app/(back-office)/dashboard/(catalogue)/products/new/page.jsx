export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function NewProduct() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  let categories = [];
  let farmers = [];

  try {
    categories = await prisma.category.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    });

    const users = await prisma.user.findMany({
      where: { role: "FARMER" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    farmers = users.map((f) => ({ id: f.id, title: f.name }));
  } catch (error) {
    console.error("Failed to fetch categories/farmers:", error);
    return (
      <div className="p-4 text-red-600">
        Failed to load form data. {error?.message || ""}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <FormHeader title="New Product" />
      <NewProductForm categories={categories} farmers={farmers} />
    </div>
  );
}
