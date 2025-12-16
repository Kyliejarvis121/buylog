// FarmerDashboard.jsx
"use client";

import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import LargeCards from "./LargeCards";
import SmallCards from "./SmallCards";
import DashboardCharts from "./DashboardCharts";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function FarmerDashboard({ sales = [], products = [], supports = [] }) {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session?.user) return <div>Please login to view your dashboard</div>;

  const [productList, setProductList] = useState(products);

  useEffect(() => {
    setProductList(products);
  }, [products]);

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/farmers/products/${productId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setProductList((prev) => prev.filter((p) => p.id !== productId));
      else alert("Failed to delete product: " + data.message);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-6">
      <Heading title="Farmer Dashboard" />

      <LargeCards sales={sales} products={productList} />
      <SmallCards orders={[]} supports={supports} />
      <DashboardCharts sales={sales} />

      <div className="mt-6">
  <Link
    href="/dashboard/farmers/products"
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    View Products
  </Link>
</div>


      <div className="mt-8 flex justify-between items-center">
        <Heading title="Products" />
        <Link
          href="/dashboard/farmers/products/new"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        {productList.length === 0 ? (
          <p className="text-gray-600">No products uploaded yet.</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-200 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-left">Title</th>
                <th className="p-2 border text-left">Category</th>
                <th className="p-2 border text-left">Price</th>
                <th className="p-2 border text-left">Stock</th>
                <th className="p-2 border text-left">Status</th>
                <th className="p-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product) => (
                <tr key={product.id} className="text-center">
                  <td className="p-2 border">{product.title || "Untitled"}</td>
                  <td className="p-2 border">{product.category?.title || "No Category"}</td>
                  <td className="p-2 border">{product.price ?? 0}</td>
                  <td className="p-2 border">{product.productStock ?? 0}</td>
                  <td className="p-2 border">{product.isActive ? "Active" : "Draft"}</td>
                  <td className="p-2 border flex gap-2 justify-center">
                    <Link
                      href={`/dashboard/farmers/products/${product.id}/edit`}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
