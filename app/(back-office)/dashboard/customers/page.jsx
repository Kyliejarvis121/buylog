export const dynamic = "force-dynamic"; 
export const revalidate = 0;

import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { getData } from "@/lib/getData";
import React from "react";
import { columns } from "./columns";

export default async function Customers() {
  const { success, data: customers, error } = await getData("customers");

  if (!success) {
    return <div className="text-red-600 p-4">Failed to fetch customers: {error}</div>;
  }

  return (
    <div>
      {/* Header */}
      <PageHeader
        heading="Customers"
        href="/dashboard/customers/new"
        linkTitle="Add Customer"
      />
      <div className="py-8">
        <DataTable data={customers} columns={columns} />
      </div>
    </div>
  );
}
