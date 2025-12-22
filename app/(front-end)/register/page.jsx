"use client";

import RegisterForm from "@/components/frontend/RegisterForm";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function Register() {
  const handleGoogle = async () => {
    try {
      const res = await signIn("google", { redirect: false, callbackUrl: "/dashboard" });
      if (res?.error) {
        toast.error(res.error || "Google signup failed");
      } else if (res?.url) {
        window.location.href = res.url;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-2xl sm:max-w-md xl:p-0 dark:bg-gray-800">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
              Create a new account
            </h1>

            {/* Manual registration */}
            <RegisterForm role="FARMER" includePhone />

            {/* Divider */}
            <div className="flex items-center gap-2">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-500 text-sm">OR</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Google sign-up/login */}
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
            >
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
