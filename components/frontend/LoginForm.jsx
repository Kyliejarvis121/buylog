"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";

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
      const loginData = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (loginData?.error) {
        toast.error("Sign-in error: Check your credentials");
      } else {
        toast.success("Login Successful");
        reset();
        router.push("/");
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
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google SignIn Error:", error);
      toast.error("Google login failed");
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your email
          </label>
          <input
            {...register("email", { required: true })}
            type="email"
            name="email"
            id="email"
            placeholder="name@company.com"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {errors.email && <small className="text-red-600 text-sm">This field is required</small>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <input
            {...register("password", { required: true })}
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {errors.password && <small className="text-red-600 text-sm">This field is required</small>}
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/forgot-password" className="shrink-0 font-medium text-blue-600 hover:underline dark:text-blue-500">
            Forgot Password
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white ${loading ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
          >
            {loading ? "Signing you in..." : "Login"}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          className="flex items-center justify-center gap-2 w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          {loadingGoogle ? "Signing in with Google..." : <><FaGoogle /> Login with Google</>}
        </button>
      </div>

      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
