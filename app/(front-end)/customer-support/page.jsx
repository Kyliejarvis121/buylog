"use client"; // ensures this is treated as a client component

import React from "react";

const CustomerSupport = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-4">
      <h1 className="text-3xl font-bold mb-4">Customer Support</h1>
      <p className="text-lg text-center max-w-xl">
        Thank you for visiting Buylog! We are currently setting up our customer support system. 
        Once we launch our office email and domain, you will be able to contact us directly here.
      </p>
    </div>
  );
};

export default CustomerSupport;
