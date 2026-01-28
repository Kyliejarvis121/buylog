"use client";

import LoginForm from "@/components/frontend/LoginForm";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      const res = await signIn("google", { redirect: false, callbackUrl: "/" });

      if (res?.error) {
        toast.error(res.error || "Google login failed");
      } else if (res?.url) {
        // Redirect manually
        window.location.href = res.url;
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
        <div className="w-full bg-white rounded-lg shadow-2xl sm:max-w-md xl:p-0 dark:bg-gray-800">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
              Login to Account
            </h1>

            {/* Credentials login */}
            <LoginForm />

            {/* Divider */}
            <div className="flex items-center gap-2">
              <hr className="flex-1 border-gray-300" />
              <span className="text-gray-500 text-sm">OR</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            
          </div>
        </div>
      </div>
    </section>
  );
}
