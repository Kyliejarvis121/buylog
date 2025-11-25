import React from "react";
import OverviewCards from "./OverviewCards";
import ProductUpload from "./ProductUpload";
import Plans from "./Plans";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { Info } from "lucide-react";

export default async function FarmerDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) return null;

  const { id, status = false, planId, planExpiresAt } = user;

  // Fetch sales, products, and plans
  const [salesRes, productsRes, plansRes] = await Promise.all([
    getData("sales"),
    getData("products"),
    getData("plans"),
  ]);

  const sales = salesRes?.data || [];
  const products = productsRes?.data || [];
  const plans = plansRes?.data || [];

  // Filter for this farmer only
  const salesById = sales.filter((sale) => sale.vendorId === id);
  const productsById = products.filter((product) => product.farmerId === id);

  // If account not approved
  if (!status) {
    return (
      <div className="max-w-2xl mx-auto min-h-screen mt-8">
        <div className="p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
          <div className="flex items-center">
            <Info className="w-4 h-4 mr-2" />
            <h3 className="text-lg font-medium">Account Under Review</h3>
          </div>
          <p className="mt-2 mb-4 text-sm">
            Your account is currently under review. It may take 24–48 hours for approval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto space-y-8">
      <OverviewCards sales={salesById} products={productsById} />

      <ProductUpload farmerId={id} />

      <Plans farmerPlanId={planId} planExpiresAt={planExpiresAt} plans={plans} />
    </div>
  );
}
