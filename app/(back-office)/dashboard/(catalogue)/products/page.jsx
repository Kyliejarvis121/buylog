import Heading from "@/components/backoffice/Heading";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { columns } from "./columns"; // make sure columns match updated schema

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const role = session.user.role;
  const userId = session.user.id;

  let allProducts = [];

  try {
    allProducts = await getData("products");

    if (role === "FARMER") {
      allProducts = allProducts.filter(
        (product) => product.farmer?.id === userId
      );
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
        <DataTable data={allProducts} columns={columns} />
      </div>
    </div>
  );
}
