"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../FormInputs/TextInput";
import TextareaInput from "../FormInputs/TextAreaInput";
import SubmitButton from "../FormInputs/SubmitButton";

export default function ProductUpload({ farmerId }) {
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    if (productImages.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    const payload = {
      ...data,
      farmerId,
      productImages,
    };

    console.log("Submitting product:", payload);
    // call your API here, e.g. makePostRequest(...)
    setLoading(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-4 rounded shadow-md"
    >
      <TextInput
        label="Product Title"
        name="title"
        register={register}
        errors={errors}
      />
      <TextInput
        label="Price"
        name="price"
        type="number"
        register={register}
        errors={errors}
      />
      <TextareaInput
        label="Description"
        name="description"
        register={register}
        errors={errors}
      />

      <div className="mb-4">
        <label className="block mb-2 text-black font-medium">
          Upload Product Images
        </label>
        <input
          type="file"
          multiple
          className="w-full text-black"
          onChange={handleFileChange}
        />
        {productImages.length > 0 && (
          <ul className="mt-2">
            {productImages.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <SubmitButton
        isLoading={loading}
        buttonTitle="Upload Product"
        loadingButtonTitle="Uploading..."
      />
    </form>
  );
}
