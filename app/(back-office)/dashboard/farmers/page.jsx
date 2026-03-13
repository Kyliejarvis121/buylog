import { prisma } from "@/lib/prismadb";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function FarmerProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Find the farmer linked to logged-in user
  const farmer = await prisma.farmer.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!farmer) {
    console.error("Farmer not found for user:", session.user.id);
    redirect("/dashboard");
  }

  let products = [];

  try {
    // Fetch products for this farmer (no include of broken relations)
    products = await prisma.product.findMany({
      where: { farmerId: farmer.id },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return (
      <div className="p-4 text-red-600">
        Failed to fetch products: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="My Products"
        href="/dashboard/farmers/products/new"
        linkTitle="Add Product"
      />

      <div className="py-4">
        <DataTable
          data={Array.isArray(products) ? products : []}
          columns={columns}
          filterKeys={["title", "category.title", "isActive"]}
        />
      </div>
    </div>
  );
}