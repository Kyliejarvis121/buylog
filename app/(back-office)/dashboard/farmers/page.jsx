export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prismadb";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";

export default async function FarmersPage() {
  let farmers = [];

  try {
    // Fetch all farmers with their linked user
    farmers = await prisma.farmer.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true }, // include related user info
    });
  } catch (error) {
    console.error("Failed to fetch farmers:", error);
    return (
      <div className="p-4 text-red-600">
        Failed to fetch farmers: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="Farmers"
        href="/dashboard/farmers/new"
        linkTitle="Add Farmer"
      />

      <div className="py-4">
        <DataTable
          data={Array.isArray(farmers) ? farmers : []}
          columns={columns} // ensure your columns handle 'user' and 'status'
          filterKeys={["name", "status"]}
        />
      </div>
    </div>
  );
}
