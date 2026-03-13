export const dynamic = "force-dynamic";
export const revalidate = 0;

import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import { columns } from "./columns";

export default async function MarketsPage() {
  const { success, data: markets, error } = await getData("markets");

  if (!success) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch markets: {error}
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
