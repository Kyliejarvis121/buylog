"use client";

import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 px-4 sm:px-6 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>

        <p className="mb-4">
          Welcome to <strong>Buylog</strong>. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our peer-to-peer marketplace platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Personal Information:</strong> Name, email, phone number, and profile details you provide when registering or using our services.</li>
          <li><strong>Transaction Information:</strong> Details about your purchases, sales, or interactions with other users.</li>
          <li><strong>Technical Information:</strong> IP address, browser type, device information, and usage data collected automatically.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside mb-4">
          <li>To provide, operate, and maintain the Buylog platform.</li>
          <li>To improve user experience, develop new features, and optimize our services.</li>
          <li>To communicate with you about transactions, updates, or promotional offers.</li>
          <li>To detect, prevent, and address technical issues or fraudulent activities.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Sharing Your Information</h2>
        <p className="mb-4">
          Buylog does not sell your personal information to third parties. We may share your information with:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Other users as necessary to facilitate transactions (e.g., buyer and seller).</li>
          <li>Service providers who assist us in operating the platform under strict confidentiality agreements.</li>
          <li>Legal authorities if required by law or to protect Buylog’s rights.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies and Tracking</h2>
        <p className="mb-4">
          We use cookies and similar technologies to enhance your experience on our platform, analyze site traffic, and understand user behavior. You can manage cookies through your browser settings.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update, or delete your personal information at any time. You may also opt-out of promotional communications. For any privacy-related requests, contact us at 
          <Link href="/support" className="text-blue-600 underline ml-1">Customer Support</Link>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Security</h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Updates to This Policy</h2>
        <p className="mb-4">
          Buylog may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Please check periodically to stay informed.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at 
          <Link href="/support" className="text-blue-600 underline ml-1">Customer Support</Link>.
        </p>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
          © 2026 Buylog. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
