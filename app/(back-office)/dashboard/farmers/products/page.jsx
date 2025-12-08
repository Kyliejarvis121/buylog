import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { columns } from "@/backoffice/dashboard/columns"; // ✅ correct path
import { getData } from "@/lib/getData";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session)
    return <p className="text-red-600">Please login to view your products</p>;

  let allProducts = [];
  try {
    const res = await getData("products");
    allProducts = res?.data || [];
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return <p className="text-red-600">Failed to load products.</p>;
  }

  // Filter only products belonging to the logged-in farmer
  const farmerProducts = allProducts.filter(
    (product) => product.farmerId === session.user.id
  );

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="My Products"
        href="/backoffice/dashboard/farmers/products/new" // correct Add Product link
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
