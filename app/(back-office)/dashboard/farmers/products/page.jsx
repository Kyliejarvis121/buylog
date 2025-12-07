import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { columns } from "./columns";

export default async function FarmerProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session) return null; // redirect to login could also be done

  const role = session.user.role;
  const userId = session.user.id;

  // Fetch all products
  const allProducts = await getData("products");

  // If farmer, filter only their products
  const farmerProducts = allProducts.filter((product) => product.farmerId === userId);

  return (
    <div>
      <PageHeader
        heading="Products"
        href={role === "FARMER" ? "/dashboard/farmers/products/new" : undefined}
        linkTitle={role === "FARMER" ? "Add Product" : undefined}
      />
      <div className="py-8">
        <DataTable
          data={role === "ADMIN" ? allProducts : farmerProducts}
          columns={columns}
        />
      </div>
    </div>
  );
}
