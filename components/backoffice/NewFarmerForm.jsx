"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ImageInput from "@/components/FormInputs/ImageInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import ArrayItemsInput from "@/components/FormInputs/ArrayItemsInput";
import { makePostRequest } from "@/lib/apiRequest";
import { generateUserCode } from "@/lib/generateUserCode";

export default function NewFarmerForm({ user }) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [products, setProducts] = useState([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { isActive: true },
  });

  const isActive = watch("isActive");

  async function onSubmit(data) {
    if (!user?.id) {
      alert("User session not found. Please login again.");
      return;
    }

    // Add additional data
    data.userId = user.id;
    data.code = generateUserCode("LFF", data.name);
    data.products = products;
    data.profileImageUrl = imageUrl;

    makePostRequest(setLoading, "api/farmers", data, "Farmer Profile", reset, () => {
      router.push("/dashboard/farmers");
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Required fields */}
        <TextInput label="Farmer's Full Name" name="name" register={register} errors={errors} />
        <TextInput label="Farmer's Phone" name="phone" register={register} errors={errors} />
        <TextInput label="Farmer's Email Address" name="email" register={register} errors={errors} />
        <TextInput label="Physical Address" name="physicalAddress" register={register} errors={errors} />
        <TextInput label="Contact Person" name="contactPerson" register={register} errors={errors} />
        <TextInput label="Contact Person Phone" name="contactPersonPhone" register={register} errors={errors} />
        <TextInput label="Land Size (Acres)" name="landSize" type="number" register={register} errors={errors} />
        <TextInput label="Main Crop" name="mainCrop" register={register} errors={errors} />
        
        {/* Products */}
        <ArrayItemsInput setItems={setProducts} items={products} itemTitle="Product" />

        {/* Profile Image */}
        <ImageInput imageUrl={imageUrl} setImageUrl={setImageUrl} endpoint="farmerProfileUploader" label="Profile Image" />

        {/* Optional fields */}
        <TextareaInput label="Payment Terms" name="terms" register={register} errors={errors} isRequired={false} />
        <TextareaInput label="Notes" name="notes" register={register} errors={errors} isRequired={false} />
        <ToggleInput label="Farmer Status" name="isActive" register={register} trueTitle="Active" falseTitle="Draft" />
      </div>

      <SubmitButton
        isLoading={loading}
        buttonTitle="Create Farmer"
        loadingButtonTitle="Creating Farmer please wait..."
      />
    </form>
  );
}
