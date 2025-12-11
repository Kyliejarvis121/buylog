export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

// Define columns for banners
const columns = [
  { Header: "Title", accessor: "title" },
  {
    Header: "Image",
    accessor: "imageUrl",
    Cell: ({ value }) => (
      <img src={value} alt="Banner" className="w-32 h-16 object-cover" />
    ),
  },
  {
    Header: "Link",
    accessor: "link",
    Cell: ({ value }) => (value ? <a href={value}>{value}</a> : "-"),
  },
  { Header: "Active", accessor: "isActive", Cell: ({ value }) => (value ? "Yes" : "No") },
  {
    Header: "Created At",
    accessor: "createdAt",
    Cell: ({ value }) => new Date(value).toLocaleString(),
  },
];

export default async function BannersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  let allBanners = [];
  try {
    allBanners = await prisma.banner.findMany({
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
    <div className="container mx-auto py-8">
      <PageHeader
        heading="Banners"
        href="/dashboard/banners/new" // Link to banner upload page
        linkTitle="Add Banner"
      />
      <div className="py-8">
        <DataTable data={allBanners} columns={columns} />
      </div>
    </div>
  );
}
