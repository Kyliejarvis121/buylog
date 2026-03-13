"use client";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 px-4 sm:px-6 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">About Buylog</h1>

        <p className="mb-4">
          Buylog is a trusted online marketplace designed to connect buyers and sellers seamlessly. 
        </p>
        <p className="mb-4">
          We provide a secure and user-friendly platform where sellers can showcase their products and buyers can easily find, 
          compare, and purchase what they need.
        </p>
        <p className="mb-4">
          Buylog simplifies online trading and helps businesses reach more customers, ensuring a smooth and reliable experience for everyone.
        </p>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
          © 2026 Buylog. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
