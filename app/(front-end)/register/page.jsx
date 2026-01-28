"use client";

import RegisterForm from "@/components/frontend/RegisterForm";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function Register() {
  // Google signup/login handler
  const handleGoogle = async () => {
    try {
      // Sign in without redirect first
      const res = await signIn("google", { redirect: false, callbackUrl: "/dashboard" });

      if (res?.error) {
        toast.error(res.error || "Google signup failed");
      } else if (res?.url) {
        // Redirect manually
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

            {/* Manual registration form */}
            <RegisterForm role="FARMER" includePhone />

            {/* Divider */}
            <div className="flex items-center gap-2 my-4">
              <hr className="flex-1 border-gray-300 dark:border-gray-600" />
              <span className="text-gray-500 dark:text-gray-400 text-sm">OR</span>
              <hr className="flex-1 border-gray-300 dark:border-gray-600" />
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
}
