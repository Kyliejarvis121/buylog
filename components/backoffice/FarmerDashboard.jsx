import React from "react";
import Heading from "@/components/backoffice/Heading";
import LargeCards from "@/components/backoffice/LargeCards";
import SmallCards from "@/components/backoffice/SmallCards";
import DashboardCharts from "@/components/backoffice/DashboardCharts";
import ProductUpload from "./Farmer/ProductUpload";
import { getData } from "@/lib/getData";

export default async function FarmerDashboard({ userId }) {
  // Fetch necessary data
  const [salesRes, productsRes, supportsRes] = await Promise.all([
    getData("sales"),
    getData("products"),
    getData("farmerSupport"),
  ]);

  const sales = salesRes?.data || [];
  const products = productsRes?.data || [];
  const supports = supportsRes?.data || [];

  // Filter for this farmer only
  const salesById = sales.filter((sale) => sale.vendorId === userId);
  const productsById = products.filter((product) => product.farmerId === userId);

  return (
    <div className="p-6">
      <Heading title="Dashboard Overview" />

      {/* Cards and charts */}
      <LargeCards sales={salesById} products={productsById} />
      <SmallCards orders={[]} supports={supports} />
      <DashboardCharts sales={salesById} />

      {/* Product upload */}
      <div className="mt-8">
        <Heading title="Upload New Product" />
        <ProductUpload farmerId={userId} />
      </div>
    </div>
  );
}
