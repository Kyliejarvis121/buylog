import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";

import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <p className="text-red-600">
        Please login to view your products
      </p>
    );
  }

  // 1️⃣ Find farmer linked to this user
  const farmer = await prisma.farmer.findFirst({
    where: { userId: session.user.id },
  });

  // 2️⃣ Fetch farmer products
  const farmerProducts = farmer
    ? await prisma.product.findMany({
        where: { farmerId: farmer.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="My Products"
        href="/dashboard/farmers/products/new"
        linkTitle="Add Product"
      />

      <div className="py-8">
        {farmerProducts.length === 0 ? (
          <p className="text-gray-600">
            You haven’t uploaded any products yet.
          </p>
        ) : (
          <DataTable
            data={farmerProducts}
            columns={columns}
          />
        )}
      </div>
    </div>
  );
}
