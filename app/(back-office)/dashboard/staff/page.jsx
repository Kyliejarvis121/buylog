// app/(back-office)/dashboard/coupons/page.jsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React from "react";
import PageHeader from "@/components/backoffice/PageHeader";
import TableActions from "@/components/backoffice/TableActions";
import DataTable from "@/components/data-table-components/DataTable";
import { prisma } from "@/lib/prismadb";
import { columns } from "./columns"; // Make sure this matches your coupons model

export default async function CouponsPage() {
  let coupons = [];

  try {
    // Fetch all coupons from the database
    coupons = await prisma.coupons.findMany({
      orderBy: { createdAt: "desc" }, // Replace with a valid field in your model
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
      {/* Page Header */}
      <PageHeader
        heading="Coupons"
        href="/dashboard/coupons/new"
        linkTitle="Add Coupon"
      />

      {/* Table Actions (Search / Export / Bulk Delete) */}
      <TableActions />

      {/* Data Table */}
      <div className="py-8">
        {coupons.length === 0 ? (
          <p>No coupons available.</p>
        ) : (
          <DataTable data={coupons} columns={columns} />
        )}
      </div>
    </div>
  );
}
