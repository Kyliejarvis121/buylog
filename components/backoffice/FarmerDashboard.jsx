import React from "react";
import Heading from "./Heading";
import LargeCards from "./LargeCards";
import SmallCards from "./SmallCards";
import DashboardCharts from "./DashboardCharts";
import ProductUpload from "./Farmer/ProductUpload";
import { getData } from "@/lib/getData";

export default async function FarmerDashboard({ userId }) {
  const [salesRes, productsRes, supportsRes] = await Promise.all([
    getData("sales"),
    getData("products"),
    getData("farmerSupport"),
  ]);

  const sales = salesRes?.data || [];
  const products = productsRes?.data || [];
  const supports = supportsRes?.data || [];

  const salesById = sales.filter(s => s.vendorId === userId);
  const productsById = products.filter(p => p.farmerId === userId);

  return (
    <div className="p-6">
      <Heading title="Dashboard Overview" />

      <LargeCards sales={salesById} products={productsById} />
      <SmallCards orders={[]} supports={supports} />
      <DashboardCharts sales={salesById} />

      <div className="mt-8">
        <Heading title="Upload New Product" />
        <ProductUpload farmerId={userId} />
      </div>
    </div>
  );
}

