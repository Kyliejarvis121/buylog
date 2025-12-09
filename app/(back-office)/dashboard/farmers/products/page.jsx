import PageHeader from "@/components/back-office/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { columns } from "./columns";
import { getData } from "@/lib/getData";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <p className="text-red-600">
        Please login to view your products
      </p>
    );
  }

  let allProducts = [];

  try {
    const res = await getData("products");
    allProducts = res?.data || [];
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    return <p className="text-red-600">Failed to load products.</p>;
  }

  // ✅ Filter products that belong to the logged-in farmer (vendor)
  const farmerProducts = allProducts.filter(
    (product) => product.farmerId === session?.user?.id
  );

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="My Products"
        href="/dashboard/farmers/products/new"  // ✅ Fully correct path
        linkTitle="Add Product"
      />

      <div className="py-8">
        {farmerProducts.length === 0 ? (
          <p className="text-gray-600">
            You haven’t uploaded any products yet.
          </p>
        ) : (
          <DataTable data={farmerProducts} columns={columns} />
        )}
      </div>
    </div>
  );
}
