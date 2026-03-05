"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        We are here to help. Reach out to us and we will respond as soon as possible.
      </p>

      {/* Contact Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">

        <div className="p-4 border rounded-lg">
          <Mail className="mb-2" />
          <h3 className="font-semibold">Email</h3>
          <p className="text-sm">info@buylogint.com</p>
          <p className="text-sm">support@buylogint.com</p>
        </div>

        <div className="p-4 border rounded-lg">
          <Phone className="mb-2" />
          <h3 className="font-semibold">Phone</h3>
          <p className="text-sm">+234 — (Add your number)</p>
        </div>

        <div className="p-4 border rounded-lg">
          <MapPin className="mb-2" />
          <h3 className="font-semibold">Address</h3>
          <p className="text-sm">Nigeria (Add address if needed)</p>
        </div>

      </div>

      {/* Contact Form */}
      <form className="space-y-4">

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            rows="4"
            className="w-full border px-4 py-2 rounded-lg"
            placeholder="Your message"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Send Message
        </button>

      </form>
    </div>
  );
}