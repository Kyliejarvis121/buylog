"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // Credentials login
  async function onSubmit(data) {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Sign-in error: Check your credentials");
      } else {
        toast.success("Login Successful!");
        reset();
        router.push("/dashboard"); // ✅ redirect to dashboard
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("Network error, try again");
    } finally {
      setLoading(false);
    }
  }

  // Google login
  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" }); // ✅ redirect to dashboard
    } catch (error) {
      console.error("Google SignIn Error:", error);
      toast.error("Google login failed");
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            id="email"
            placeholder="name@company.com"
            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            id="password"
            placeholder="••••••••"
            className="w-full p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password & Submit */}
        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline dark:text-blue-500"
          >
            Forgot Password?
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2.5 text-white rounded-lg text-sm font-medium focus:ring-4 focus:outline-none ${
              loading
                ? "bg-blue-700"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-2 my-4">
        <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        <span className="text-gray-500 dark:text-gray-400 text-sm">or</span>
        <hr className="flex-grow border-gray-300 dark:border-gray-600" />
      </div>

      

      {/* Sign up link */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:underline dark:text-blue-500 font-medium"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
