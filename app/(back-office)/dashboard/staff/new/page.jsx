"use client";

import SubmitButton from "@/components/FormInputs/SubmitButton";
import TextareaInput from "@/components/FormInputs/TextAreaInput";
import TextInput from "@/components/FormInputs/TextInput";
import ToggleInput from "@/components/FormInputs/ToggleInput";
import FormHeader from "@/components/backoffice/FormHeader";

import { makePostRequest } from "@/lib/apiRequest";
import { generateUserCode } from "@/lib/generateUserCode";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewStaff() {
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
    },
  });

  async function onSubmit(data) {
    // Generate unique staff code
    const code = generateUserCode("LSM", data.name);
    data.code = code;

    console.log("SUBMITTING STAFF:", data);

    makePostRequest(setLoading, "api/staffs", data, "Staff", reset);
  }

  return (
    <div>
      <FormHeader title="New Staff" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 
               rounded-lg shadow sm:p-6 md:p-8 mx-auto my-3 
               dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          
          <TextInput
            label="Staff Full Name"
            name="name"
            register={register}
            errors={errors}
          />

          <TextInput
            label="NIN (ID Number)"
            name="nin"
            register={register}
            errors={errors}
          />

          <TextInput
            label="Date of Birth"
            name="dob"
            type="date"
            register={register}
            errors={errors}
          />

          <TextInput
            label="Password"
            name="password"
            type="password"
            register={register}
            errors={errors}
          />

          <TextInput
            label="Staff Email Address"
            name="email"
            type="email"
            register={register}
            errors={errors}
          />

          <TextInput
            label="Staff Phone"
            name="phone"
            type="tel"
            register={register}
            errors={errors}
          />

          <TextInput
            label="Physical Address"
            name="physicalAddress"
            register={register}
            errors={errors}
          />

          <TextareaInput
            label="Notes"
            name="notes"
            register={register}
            errors={errors}
            isRequired={false}
          />

          <ToggleInput
            label="Staff Member Status"
            name="isActive"
            trueTitle="Active"
            falseTitle="Draft"
            register={register}
          />
        </div>

        <SubmitButton
          isLoading={loading}
          buttonTitle="Create Staff"
          loadingButtonTitle="Creating staff, please wait..."
        />
      </form>
    </div>
  );
}
