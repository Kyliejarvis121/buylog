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
      <p className="p-6 text-red-400">
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
        include: { category: true },
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <PageHeader
        heading="My Products"
        href="/dashboard/farmers/products/new"
        linkTitle="Add Product"
      />

      <div className="mt-6">
        {farmerProducts.length === 0 ? (
          <p className="text-zinc-400">
            You haven’t uploaded any products yet.
          </p>
        ) : (
          /* 👇 MOBILE OVERFLOW FIX */
          <div className="relative overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="min-w-[900px]">
              <DataTable
                data={farmerProducts}
                columns={columns}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
