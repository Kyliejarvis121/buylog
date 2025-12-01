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

export default async function CouponsPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const { id: userId, role } = session.user;

  let allCoupons = [];

  try {
    allCoupons = await prisma.coupon.findMany({
      where: role === "ADMIN" ? {} : { vendorId: userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to fetch coupons: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="Coupons"
        href="/dashboard/coupons/new"
        linkTitle="Add Coupon"
      />

      <div className="py-8">
        <DataTable data={allCoupons} columns={columns} />
      </div>
    </div>
  );
}
