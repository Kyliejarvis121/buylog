import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { columns } from "./columns";
import { getData } from "@/lib/getData";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="text-red-600">Please login to view your products</p>;
  }

  let allProducts = [];
  let farmerProducts = [];

  try {
    const res = await getData("products");
    allProducts = res?.data || [];

    // Get the farmer linked to the logged-in user
    const farmerRes = await getData("farmers");
    const farmer = farmerRes?.data?.find(f => f.userId === session.user.id);

    // Filter products for this farmer
    if (farmer) {
      farmerProducts = allProducts.filter(
        (product) => product.farmerId === farmer.id
      );
    }
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    return <p className="text-red-600">Failed to load products.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="My Products"
        href="/dashboard/farmers/products/new"
        linkTitle="Add Product"
      />

      <div className="py-8">
        {farmerProducts.length === 0 ? (
          <p className="text-gray-600">You haven’t uploaded any products yet.</p>
        ) : (
          <DataTable data={farmerProducts} columns={columns} />
        )}
      </div>
    </div>
  );
}
