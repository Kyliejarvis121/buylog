import PageHeader from "@/components/backoffice/PageHeader"; // <-- add this
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import { prisma } from "@/lib/prismadb";

export default async function BannersPage() {
  let banners = [];
  try {
    banners = await prisma.banners.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return <div className="p-4 text-red-600">Failed to fetch banners: {error?.message}</div>;
  }

  return (
    <div>
      <PageHeader
        heading="Banners"
        href="/dashboard/banners/new"
        linkTitle="Add Banner"
      />
      <div className="py-8">
        <DataTable data={banners} columns={columns} />
      </div>
    </div>
  );
}
