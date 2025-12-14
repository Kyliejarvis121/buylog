"use client";

import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "@/components/backoffice/farmers/products/columns";
import { useEffect, useState } from "react";

export default function FarmerProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="py-6">
      <PageHeader
        heading="Products"
        href="/dashboard/farmers/products/new"
        linkTitle="Add Product"
      />
      <div className="py-4">
        <DataTable data={products} columns={columns} />
      </div>
    </div>
  );
}
