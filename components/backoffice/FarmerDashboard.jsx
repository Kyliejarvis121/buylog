import React from "react";
import Heading from "./Heading";
import LargeCards from "./LargeCards";
import SmallCards from "./SmallCards";
import DashboardCharts from "./DashboardCharts";
import ProductUpload from "./Farmer/ProductUpload"; // the improved upload component

export default function FarmerDashboard({ sales, products, supports, farmerId }) {
  return (
    <div className="p-6">
      <Heading title="Farmer Dashboard" />
      <LargeCards sales={sales || []} products={products || []} />
      <SmallCards orders={[]} supports={supports || []} />
      <DashboardCharts sales={sales || []} />

      <div className="mt-8">
        <Heading title="Upload New Product" />
        <ProductUpload farmerId={farmerId} /> {/* black background, multiple images */}
      </div>
    </div>
  );
}
