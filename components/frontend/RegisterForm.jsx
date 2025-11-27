"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
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
    try {
      setLoading(true);
      setEmailErr("");

      const response = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setEmailErr("Email already exists");
          toast.error("Email already registered");
        } else {
          toast.error(res.message || "Registration failed");
        }
        return;
      }

      toast.success("Registration successful!");

      // Automatically login user
      const loginRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (loginRes?.error) {
        toast.success("Registered! Please login manually.");
        router.push("/login");
      } else {
        router.push("/");
      }

    } catch (error) {
      console.error(error);
      toast.error("Network error, try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">

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

      {/* Optional Farmer Fields */}
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
        loadingButtonTitle="Creating account..."
      />

      {/* Google Sign Up */}
      <button
        type="button"
        onClick={() => signIn("google")}
        className="w-full mt-4 py-2 bg-red-500 text-white rounded-md"
      >
        Continue with Google
      </button>

      {/* Links */}
      <div className="flex gap-2 justify-between">
        <p className="text-[0.75rem] text-gray-500 py-4">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 hover:underline">
            Login
          </Link>
        </p>

        {role === "USER" ? (
          <p className="text-[0.75rem] text-gray-500 py-4">
            Are you a Farmer?{" "}
            <Link href="/register?role=FARMER" className="text-purple-600 hover:underline">
              Register here
            </Link>
          </p>
        ) : (
          <p className="text-[0.75rem] text-gray-500 py-4">
            Are you a User?{" "}
            <Link href="/register" className="text-purple-600 hover:underline">
              Register here
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}

