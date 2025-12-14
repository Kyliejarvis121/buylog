import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";
import { columns } from "./columns";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const role = session.user.role;
  const userId = session.user.id;

  let products = [];

  try {
    if (role === "FARMER") {
      // ✅ Get farmer record first
      const farmer = await prisma.farmer.findFirst({
        where: { userId },
        select: { id: true },
      });

      if (!farmer) {
        return <div className="p-4 text-red-600">Farmer not found</div>;
      }

      // ✅ Fetch ONLY this farmer’s products
      products = await getData(`products?farmerId=${farmer.id}`);
    } else {
      // Admin sees all products
      products = await getData("products");
    }
  } catch (error) {
    console.error("Failed to load products:", error);
    return <div className="p-4 text-red-600">Failed to load products</div>;
  }

  return (
    <div>
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
