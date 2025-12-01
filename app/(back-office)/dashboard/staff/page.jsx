export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { columns } from "./columns";

export default async function StaffPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const { role, id: userId } = session.user;

  let allStaff = [];

  try {
    allStaff = await prisma.staff.findMany({
      where: role === "ADMIN" ? {} : { ownerId: userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch staff: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="Staff"
        href="/dashboard/staff/new"
        linkTitle="Add Staff"
      />

      <div className="py-8">
        <DataTable data={allStaff} columns={columns} />
      </div>
    </div>
  );
}
