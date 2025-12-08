import React from "react";
import Heading from "./Heading";
import LargeCards from "./LargeCards";
import SmallCards from "./SmallCards";
import DashboardCharts from "./DashboardCharts";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function FarmerDashboard({ sales, products, supports }) {
  const session = await getServerSession(authOptions);
  if (!session) return <div>Please login to view your dashboard</div>;

  const userId = session.user.id;

  return (
    <div className="p-6">
      <Heading title="Farmer Dashboard" />

      <LargeCards sales={sales || []} products={products || []} />
      <SmallCards orders={[]} supports={supports || []} />
      <DashboardCharts sales={sales || []} />

      {/* New Product Section */}
      <div className="mt-8 flex justify-between items-center">
        <Heading title="Products" />
        <Link
          href="/backoffice/dashboard/farmers/products/new"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Product
        </Link>
      </div>

      <div className="mt-6">
        {products.length === 0 ? (
          <p className="text-gray-600">No products uploaded yet.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="text-center">
                  <td className="p-2 border">{product.title}</td>
                  <td className="p-2 border">{product.category?.title}</td>
                  <td className="p-2 border">{product.productPrice}</td>
                  <td className="p-2 border">{product.productStock}</td>
                  <td className="p-2 border">
                    {product.isActive ? "Active" : "Draft"}
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

