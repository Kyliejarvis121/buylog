"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

import SubmitButton from "../FormInputs/SubmitButton";
import TextInput from "../FormInputs/TextInput";

export default function RegisterForm() {
  const router = useRouter();

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

      // 1️⃣ Register user
      const response = await fetch("/api/register", {
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

      toast.success("Account created successfully");

      // 2️⃣ Auto login after registration
      const login = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (login?.error) {
        toast.error("Login failed. Please login manually.");
        return;
      }

      // 3️⃣ Reset form & redirect to dashboard
      reset();
      router.push("/dashboard");

    } catch (error) {
      console.error(error);
      toast.error("Network error, try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      {/* Full Name */}
      <TextInput
        label="Full Name"
        name="name"
        register={register}
        errors={errors}
        type="text"
        className="mb-3"
      />

      {/* Email */}
      <TextInput
        label="Email Address"
        name="email"
        register={register}
        errors={errors}
        type="email"
        className="mb-3"
      />
      {emailErr && (
        <small className="text-red-600 -mt-2 mb-2 block">
          {emailErr}
        </small>
      )}

      {/* Password */}
      <TextInput
        label="Password"
        name="password"
        register={register}
        errors={errors}
        type="password"
        className="mb-3"
      />

      {/* Farm Name */}
      <TextInput
        label="Farm Name"
        name="farmName"
        register={register}
        errors={errors}
        type="text"
        className="mb-3"
      />

      {/* Optional Phone */}
      <TextInput
        label="Phone Number (Optional)"
        name="phone"
        register={register}
        errors={errors}
        type="text"
        className="mb-3"
      />

      {/* Optional Address */}
      <TextInput
        label="Physical Address (Optional)"
        name="physicalAddress"
        register={register}
        errors={errors}
        type="text"
        className="mb-4"
      />

      <SubmitButton
        isLoading={loading}
        buttonTitle="Create Account"
        loadingButtonTitle="Creating account..."
      />

      {/* Google Sign Up */}
      <button
        type="button"
        onClick={() => signIn("google")}
        className="w-full mt-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Continue with Google
      </button>

      {/* Login Link */}
      <p className="text-[0.75rem] text-gray-500 py-4 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-purple-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
