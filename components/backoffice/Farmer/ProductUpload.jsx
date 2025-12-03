"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../FormInputs/TextInput";
import TextareaInput from "../FormInputs/TextAreaInput";
import SubmitButton from "../FormInputs/SubmitButton";
import axios from "axios";

export default function ProductUpload({ farmerId }) {
  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    if (productImages.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    if (productImages.length > 5) {
      alert("You can only upload up to 5 images");
      return;
    }

    try {
      setLoading(true);

      // Upload images first (you can have a dedicated uploader endpoint)
      const uploadedImages = [];
      for (let i = 0; i < productImages.length; i++) {
        const formData = new FormData();
        formData.append("file", productImages[i]);

        const res = await axios.post(
          "/api/upload/productImages", // create this endpoint to handle image uploads
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        uploadedImages.push(res.data.url);
      }

      // Create product object
      const payload = {
        ...data,
        farmerId,
        productImages: uploadedImages,
      };

      // Call farmer API to save product
      await axios.post("/api/farmers", payload);

      alert("Product uploaded successfully!");
      reset();
      setProductImages([]);
    } catch (err) {
      console.error(err);
      alert("Failed to upload product");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages(files);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-black p-6 rounded-md shadow-md space-y-4"
    >
      <TextInput
        label="Product Title"
        name="title"
        register={register}
        errors={errors}
        inputClass="text-black"
      />
      <TextInput
        label="Price"
        name="price"
        type="number"
        register={register}
        errors={errors}
        inputClass="text-black"
      />
      <TextareaInput
        label="Description"
        name="description"
        register={register}
        errors={errors}
        inputClass="text-black"
      />

      <div className="mb-4">
        <label className="block mb-2 text-white font-medium">
          Upload Product Images (max 5)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full bg-black text-white p-2 rounded border border-gray-700"
        />
        {productImages.length > 0 && (
          <ul className="mt-2 text-white">
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
