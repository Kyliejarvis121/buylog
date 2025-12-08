"use client";

import PageHeader from "@/components/backoffice/PageHeader";
import ProductUpload from "@/components/backoffice/Farmer/ProductUpload"; // Your upload component
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Please login to upload a product</p>;
  }

  const userId = session.user.id;

  return (
    <div className="container mx-auto py-8">
      {/* Page header with corrected link */}
      <PageHeader
        heading="Add New Product"
        href="/backoffice/dashboard/farmer/products"
        linkTitle="Back to Products"
      />

      <div className="mt-8">
        {/* Upload component */}
        <ProductUpload farmerId={userId} />
      </div>
    </div>
  );
}
