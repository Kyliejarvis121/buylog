import FormHeader from "@/components/backoffice/FormHeader";
import CouponForm from "@/components/backoffice/Forms/CouponForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function UpdateCoupon({ params: { id } }) {
  const { success, data: coupon, error } = await getData(`coupons/${id}`);

  if (!success || !coupon) {
    return (
      <div className="p-4 text-red-600">
        Failed to load coupon: {error}
      </div>
    );
  }

  return (
    <div>
      <FormHeader title="Update Coupon" />
      <CouponForm updateData={coupon} />
    </div>
  );
}
