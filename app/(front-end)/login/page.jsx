"use client";
import LoginForm from "@/components/frontend/LoginForm";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Login to Account
            </h1>

            {/* Existing login form */}
            <LoginForm />

            {/* OR separator */}
            <div className="flex items-center justify-center mt-4">
              <span className="text-gray-500 dark:text-gray-400">or</span>
            </div>

            {/* Google login button */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex justify-center items-center px-4 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
            >
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
