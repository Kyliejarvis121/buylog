"use client";
import TextInput from "@/components/FormInputs/TextInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import FormHeader from "@/components/backoffice/FormHeader";

import { makeRequest, makePutRequest } from "@/lib/apiRequest";
import { convertIsoDateToNormal } from "@/lib/convertIsoDatetoNormal";
import { generateCouponCode } from "@/lib/generateCouponCode";
import { generateIsoFormattedDate } from "@/lib/generateIsoFormattedDate";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function CouponForm({ updateData = {} }) {
  const { data: session } = useSession();
  const vendorId = session?.user?.id;

  const expiryDateNormal = convertIsoDateToNormal(updateData.expiryDate);
  const id = updateData?.id ?? "";

  if (updateData?.expiryDate) {
    updateData.expiryDate = expiryDateNormal;
  }

  const [loading, setLoading] = useState(false);

  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
      ...updateData,
    },
  });

  const router = useRouter();
  function redirect() {
    router.push("/dashboard/coupons");
  }

  async function onSubmit(data) {
    data.vendorId = vendorId;

    const couponCode = generateCouponCode(data.title, data.expiryDate);
    const isoFormattedDate = generateIsoFormattedDate(data.expiryDate);

    data.expiryDate = isoFormattedDate;
    data.couponCode = couponCode;

    if (id) {
      makePutRequest(setLoading, `api/coupons/${id}`, data, "Coupon", redirect, reset);
    } else {
      makeRequest(
        setLoading,
        "api/coupons",
        data,
        "Coupon created successfully",
        reset,
        redirect
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <FormHeader title={id ? "Edit Coupon" : "New Coupon"} />

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput
          label="Coupon Title"
          name="title"
          register={register}
          errors={errors}
        />
        <TextInput
          label="Expiry Date"
          name="expiryDate"
          type="date"
          register={register}
          errors={errors}
        />
        <ToggleInput
          label="Publish Coupon"
          name="isActive"
          trueTitle="Active"
          falseTitle="Draft"
          register={register}
        />
      </div>

      <SubmitButton
        isLoading={loading}
        buttonTitle={id ? "Update Coupon" : "Create Coupon"}
        loadingButtonTitle={`${id ? "Updating" : "Creating"} coupon...`}
      />
    </form>
  );
}