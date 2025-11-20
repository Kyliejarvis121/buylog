import { prisma } from "@/lib/prismadb";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";

export default async function MarketsPage() {
  let markets = [];
  try {
    markets = await prisma.markets.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Error fetching markets: {error.message}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        heading="Markets"
        href="/dashboard/markets/new"
        linkTitle="Add Market"
      />
      <div className="py-0">
        <DataTable data={markets} columns={columns} />
      </div>
    </div>
  );
}
