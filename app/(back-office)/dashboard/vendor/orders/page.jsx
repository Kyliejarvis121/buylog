export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { columns } from "./columns";

export default async function CouponsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p className="p-4 text-red-600">Unauthorized</p>;
  }

  const userId = session.user.id;
  const role = session.user.role;

  let allSales = [];

  try {
    allSales = await prisma.sales.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch sales: {error?.message || "Unknown error"}
      </div>
    );
  }

  // Filter for vendors
  const farmerSales = role === "ADMIN" ? allSales : allSales.filter((sale) => sale.vendorId === userId);

  return (
    <div>
      <PageHeader
        heading="Coupons"
        href="/dashboard/coupons/new"
        linkTitle="Add Coupon"
      />
      <div className="py-8">
        <DataTable data={farmerSales} columns={columns} />
      </div>
    </div>
  );
}
