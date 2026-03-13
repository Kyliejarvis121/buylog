"use client";

import PageHeader from "@/components/backoffice/PageHeader";
import DataTable from "@/components/data-table-components/DataTable";
import { columns } from "./columns";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?page=1&limit=1000"); // fetch all products
        const data = await res.json();

        if (data.success) {
          setProducts(data.data || []);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Products fetch error:", error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        heading="My Products"
        href="/dashboard/farmers/products/new"
        linkTitle="Add Product"
      />

      <div className="py-8">
        {products.length === 0 ? (
          <p className="text-gray-600">You haven’t uploaded any products yet.</p>
        ) : (
          <DataTable data={products} columns={columns} />
        )}
      </div>
    </div>
  );
}
