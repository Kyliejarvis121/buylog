import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import { prisma } from "@/lib/prismadb"; // Use Prisma directly

export default async function BannersPage() {
  const banners = await prisma.banners.findMany({
    orderBy: { createdAt: "desc" },
  });

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
