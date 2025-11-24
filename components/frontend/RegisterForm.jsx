"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";

export default function RegisterForm({ role = "USER" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState("");

  async function onSubmit(data) {
    data.plan = plan;
    data.role = role; // make sure role is set

    try {
      setLoading(true);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setLoading(false);
        toast.success("User Created Successfully");
        reset();

        if (role === "USER") {
          router.push("/");
        } else if (role === "FARMER") {
          // redirect to verification page or thank you page
          router.push(`/verify-email?userId=${responseData.data.id}`);
        }
      } else {
        setLoading(false);

        if (response.status === 409) {
          setEmailErr("User with this Email already exists");
          toast.error("User with this Email already exists");
        } else {
          console.error("Server Error:", responseData.error);
          toast.error("Oops! Something went wrong.");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Something went wrong, please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      {/* Hidden Role */}
      <TextInput
        label=""
        name="role"
        register={register}
        errors={errors}
        type="hidden"
        defaultValue={role}
        className="sm:col-span-2 mb-3"
      />

      {/* Name */}
      <TextInput
        label="Full Name"
        name="name"
        register={register}
        errors={errors}
        type="text"
        className="sm:col-span-2 mb-3"
      />

      {/* Email */}
      <TextInput
        label="Email Address"
        name="email"
        register={register}
        errors={errors}
        type="email"
        className="sm:col-span-2 mb-3"
      />
      {emailErr && <small className="text-red-600 -mt-2 mb-2">{emailErr}</small>}

      {/* Password */}
      <TextInput
        label="Password"
        name="password"
        register={register}
        errors={errors}
        type="password"
        className="sm:col-span-2 mb-3"
      />

      {/* Optional Fields for Farmers */}
      {role === "FARMER" && (
        <>
          <TextInput
            label="Phone Number"
            name="phone"
            register={register}
            errors={errors}
            type="text"
            className="sm:col-span-2 mb-3"
          />
          <TextInput
            label="Physical Address"
            name="physicalAddress"
            register={register}
            errors={errors}
            type="text"
            className="sm:col-span-2 mb-3"
          />
        </>
      )}

      <SubmitButton
        isLoading={loading}
        buttonTitle="Register"
        loadingButtonTitle="Creating, please wait..."
      />

      <div className="flex gap-2 justify-between">
        <p className="text-[0.75rem] font-light text-gray-500 py-4">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-purple-600 hover:underline">
            Login
          </Link>
        </p>
        {role === "USER" ? (
          <p className="text-[0.75rem] font-light text-gray-500 py-4">
            Are you a Farmer?{" "}
            <Link href="/register?role=FARMER" className="font-medium text-purple-600 hover:underline">
              Register here
            </Link>
          </p>
        ) : (
          <p className="text-[0.75rem] font-light text-gray-500 py-4">
            Are you a User?{" "}
            <Link href="/register" className="font-medium text-purple-600 hover:underline">
              Register here
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
