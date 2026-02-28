"use client";

import React, { useEffect, useState } from "react";
import Heading from "./Heading";
import LargeCards from "./LargeCards";
import SmallCards from "./SmallCards";
import DashboardCharts from "./DashboardCharts";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProfileCard from "@/components/backoffice/profile/ProfileCard";
import SupportWidget from "@/components/Support/SupportWidget";

/* Customer Inbox Preview */
import CustomerInboxPreview from "@/components/backoffice/chat/CustomerInboxPreview";

export default function FarmerDashboard({
  sales = [],
  products = [],
  supports = [],
}) {
  const { data: session, status } = useSession();

  const safeSales = Array.isArray(sales) ? sales : [];
  const safeSupports = Array.isArray(supports) ? supports : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const [productList, setProductList] = useState(
    safeProducts.map(transformProduct)
  );

  useEffect(() => {
    setProductList(safeProducts.map(transformProduct));
  }, [safeProducts]);

  function transformProduct(p) {
    return {
      id: p.id,
      title: p.title || "Untitled",
      category: p.category || { title: "No Category" },
      price: p.price ?? 0,
      productStock: p.productStock ?? 0,
      isActive: p.isActive ?? false,
    };
  }

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/farmers/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setProductList((prev) => prev.filter((p) => p.id !== productId));
      } else {
        alert("Failed to delete product: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  if (status === "loading") {
    return <div className="p-6 text-zinc-600">Loading...</div>;
  }

  if (!session?.user) {
    return (
      <div className="p-6 text-red-500">
        Please login to view your dashboard
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 min-h-screen text-zinc-900 dark:text-zinc-100">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <Heading title="Farmer Dashboard" />

        <div className="w-full lg:w-[320px]">
          <ProfileCard user={session.user} />
        </div>
      </div>

      {/* STATS */}
      <LargeCards sales={safeSales} products={productList} />
      <SmallCards orders={[]} supports={safeSupports} />
      <DashboardCharts sales={safeSales} />

      {/* CUSTOMER MESSAGES */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <Heading title="Customer Messages" />
          <Link
            href="/dashboard/inbox"
            className="text-sm text-blue-500 hover:underline"
          >
            View All
          </Link>
        </div>

        <CustomerInboxPreview />
      </div>

      {/* QUICK ACTION */}
      <div>
        <Link
          href="/dashboard/farmers/products"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View Products
        </Link>
      </div>

      {/* PRODUCTS HEADER */}
      <div className="flex justify-between items-center">
        <Heading title="Products" />
        <Link
          href="/dashboard/farmers/products/new"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Add New Product
        </Link>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        {productList.length === 0 ? (
          <p className="p-6 text-zinc-500">
            Click to View Your Product.
          </p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition"
                >
                  <td className="p-3">{product.title}</td>
                  <td className="p-3">
                    {product.category?.title ?? "No Category"}
                  </td>
                  <td className="p-3">₦{product.price}</td>
                  <td className="p-3">{product.productStock}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.isActive
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {product.isActive ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/dashboard/farmers/products/${product.id}/edit`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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

      {/* SUPPORT CHAT */}
      <SupportWidget />
    </div>
  );
}