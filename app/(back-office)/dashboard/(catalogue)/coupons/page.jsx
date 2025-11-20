import React from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { columns } from "./columns";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CouponsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <p className="p-4 text-red-600">Unauthorized</p>;
  }

  const userId = session.user.id;
  const role = session.user.role;

  let allCoupons = [];

  try {
    allCoupons = await prisma.coupons.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch coupons: {error?.message || "Unknown error"}
      </div>
    );
  }

  // Filter coupons for non-admin users
  const farmerCoupons = role === "ADMIN" ? allCoupons : allCoupons.filter(c => c.vendorId === userId);

  return (
    <div>
      <PageHeader
        heading="Coupons"
        href="/dashboard/coupons/new"
        linkTitle="Add Coupon"
      />
      <div className="py-8">
        <DataTable data={farmerCoupons} columns={columns} />
      </div>
    </div>
  );
}
