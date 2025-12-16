"use client";

import LoginForm from "@/components/frontend/LoginForm";
import { signIn } from "next-auth/react";

export default function Login() {
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

            {/* Google login */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
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
