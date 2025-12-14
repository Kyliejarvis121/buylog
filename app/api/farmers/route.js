import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";
import { columns } from "./columns";

export default async function FarmerProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const userId = session.user.id;

  // 🔹 Get the farmer linked to this user
  const farmer = await prisma.farmer.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!farmer) {
    return <div className="p-4 text-red-600">Farmer record not found</div>;
  }

  let products = [];
  try {
    // Fetch only products belonging to this farmer
    products = await prisma.product.findMany({
      where: { farmerId: farmer.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    return <div className="p-4 text-red-600">Failed to load products: {err.message}</div>;
  }

  return (
    <div>
      <PageHeader
        heading="Products"
        href="/dashboard/farmers/products/new"
        linkTitle="Add Product"
      />
      <div className="py-6">
        <DataTable
          data={products}
          columns={columns}
          filterKeys={["title", "category.title"]}
        />
      </div>
    </div>
  );
}
