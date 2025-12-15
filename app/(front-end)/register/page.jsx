"use client"


import RegisterForm from "@/components/frontend/RegisterForm";

export default function Register() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-2xl sm:max-w-md xl:p-0 dark:bg-gray-800">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
              Create a new account
            </h1>

            {/* Manual registration ONLY */}
            <RegisterForm role="USER" />
          </div>
        </div>
      </div>
    </section>
  );
}
