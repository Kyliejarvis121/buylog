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

  // ✅ Manual registration
  async function onSubmit(data) {
    try {
      setLoading(true);
      setEmailErr("");

      // Force role to FARMER (if backend expects it)
      data.role = "FARMER";

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      // ❌ Error handling
      if (!response.ok) {
        if (response.status === 409) {
          setEmailErr("Email already exists");
          toast.error("Email already registered");
        } else {
          toast.error(res?.message || "Registration failed");
        }
        return;
      }

      // ✅ Success
      toast.success("Account created! Please check your email to verify.");
      reset();

      // 👉 Redirect to login page after successful registration
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Network error, try again.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Google signup/login
  const handleGoogleSignup = async () => {
    try {
      const res = await signIn("google", { redirect: false, callbackUrl: "/dashboard" });

      if (res?.error) {
        toast.error("Google signup failed");
      } else if (res?.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      console.error(err);
      toast.error("Google signup failed");
    }
  };

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
        <small className="text-red-600 -mt-2 mb-2 block">{emailErr}</small>
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

      {/* Submit button */}
      <SubmitButton
        isLoading={loading}
        buttonTitle="Create Account"
        loadingButtonTitle="Creating account..."
      />

      {/* Google signup button (optional UI hook) */}
      {/* 
      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full mt-3 bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Sign up with Google
      </button>
      */}

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
