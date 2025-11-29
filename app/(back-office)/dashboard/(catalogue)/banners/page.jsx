export const dynamic = "force-dynamic";
export const revalidate = 0;

import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import { prisma } from "@/lib/prismadb";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function BannersPage() {
  // Protect the route
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  let banners = [];

  try {
    // IMPORTANT: use the correct model name (check schema.prisma)
    banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch banners: {error?.message || "Unknown error"}
      </div>
    );
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
