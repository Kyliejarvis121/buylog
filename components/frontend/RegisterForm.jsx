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
    data.role = role.toUpperCase();   // FIXED
    data.plan = plan;

    try {
      setLoading(true);
      setEmailErr("");

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful");

        // Auto-login after registration
        const loginResponse = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (!loginResponse?.error) {
          router.push("/dashboard");
        } else {
          toast.success("Please login manually.");
          router.push("/login");
        }
      } else {
        if (response.status === 409) {
          setEmailErr("User with this email already exists");
          toast.error("User with this email already exists");
        } else {
          toast.error(result.message || "Something went wrong");
        }
      }
    } catch (err) {
      toast.error("Network error, try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Hidden Role */}
      <input type="hidden" {...register("role")} defaultValue={role.toUpperCase()} />

      {/* Full Name */}
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
      {emailErr && <small className="text-red-500">{emailErr}</small>}

      {/* Password */}
      <TextInput
        label="Password"
        name="password"
        register={register}
        errors={errors}
        type="password"
        className="sm:col-span-2 mb-3"
      />

      {/* Farmer fields */}
      {role === "FARMER" && (
        <>
          <TextInput
            label="Phone Number"
            name="phone"
            register={register}
            errors={errors}
            type="text"
            className="mb-3"
          />
          <TextInput
            label="Physical Address"
            name="physicalAddress"
            register={register}
            errors={errors}
            type="text"
            className="mb-3"
          />
        </>
      )}

      <SubmitButton
        isLoading={loading}
        buttonTitle="Register"
        loadingButtonTitle="Creating account..."
      />

      {/* GOOGLE SIGN-IN BUTTON */}
      <button
        type="button"
        onClick={() => signIn("google")}
        className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg"
      >
        Continue with Google
      </button>

      <div className="flex justify-between mt-5 text-sm">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600">Login</Link>
        </p>

        {role === "USER" ? (
          <p>
            Are you a Farmer?{" "}
            <Link href="/register?role=FARMER" className="text-purple-600">
              Register here
            </Link>
          </p>
        ) : (
          <p>
            Are you a User?{" "}
            <Link href="/register" className="text-purple-600">
              Register here
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
