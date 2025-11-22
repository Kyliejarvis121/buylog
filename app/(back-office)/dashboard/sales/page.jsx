export const dynamic = "force-dynamic";
export const revalidate = 0;

import DataTable from "@/components/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { columns } from "./columns";

export default async function Sales() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="p-4 text-red-600 text-center">Unauthorized — Please log in.</p>;
  }

  const id = session.user.id;
  const role = session.user.role?.toUpperCase() || "USER";

  let allSales = [];
  try {
    allSales = await getData("sales");
  } catch (error) {
    console.error("Failed to fetch sales:", error);
  }

  // Filter sales for FARMER role
  const farmerSales = role === "FARMER" ? allSales.filter((sale) => sale.vendorId === id) : allSales;

  return (
    <div className="py-8">
      <DataTable data={farmerSales} columns={columns} />
    </div>
  );
}
