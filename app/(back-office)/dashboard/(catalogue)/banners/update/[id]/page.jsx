import FormHeader from "@/components/backoffice/FormHeader";
import BannerForm from "@/components/backoffice/Forms/BannerForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function UpdateBanner({ params: { id } }) {
  const { success, data: banner, error } = await getData(`banners/${id}`);

  if (!success) {
    return (
      <div className="p-4 text-red-600">
        Failed to load banner: {error}
      </div>
    );
  }

  return (
    <div>
      <FormHeader title="Update Banner" />
      <BannerForm updateData={banner} />
    </div>
  );
}
