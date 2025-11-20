import { prisma } from "@/lib/prismadb";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FarmersPage() {
  let farmers = [];
  try {
    farmers = await prisma.farmers.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch farmers: {error.message}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        heading="Farmers"
        href="/dashboard/farmers/new"
        linkTitle="Add Farmer"
      />
      <div className="py-0">
        <DataTable data={farmers} columns={columns} filterKeys={["name"]} />
      </div>
    </div>
  );
}
