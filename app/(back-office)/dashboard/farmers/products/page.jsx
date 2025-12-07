import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { columns } from "./columns";
import { getData } from "@/lib/getData";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const allProducts = await getData("products");
  const farmerProducts = allProducts.filter(
    (product) => product.farmerId === session.user.id
  );

  return (
    <div>
      <PageHeader
        heading="My Products"
        href="/farmer/products/new"
        linkTitle="Add Product"
      />
      <div className="py-8">
        <DataTable data={farmerProducts} columns={columns} />
      </div>
    </div>
  );
}

