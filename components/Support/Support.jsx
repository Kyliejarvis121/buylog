"use client";
import { useState } from "react";
import { GoPlus, GoDash } from "react-icons/go";

const faqData = [
  {
    id: 1,
    question: "What is BUYLOG?",
    answer:
      "BUYLOG is a marketplace platform that connects buyers and sellers. Sellers list their products or services, and buyers can discover and contact sellers directly. Our goal is to enable seamless marketplace interactions and business opportunities.",
  },
  {
    id: 2,
    question: "How does BUYLOG support sellers?",
    answer:
      "BUYLOG provides a platform where sellers can showcase what they offer and reach potential customers. Sellers manage their listings and business interactions, while BUYLOG facilitates discovery and connection within the marketplace.",
  },
  {
    id: 3,
    question: "How does BUYLOG support buyers?",
    answer:
      "BUYLOG allows buyers to browse marketplace listings and connect with sellers. Buyers can explore options and communicate with sellers to inquire about products or services that interest them.",
  },
  {
    id: 4,
    question: "Is BUYLOG responsible for transactions?",
    answer:
      "No. BUYLOG is a marketplace platform that connects users. Transactions and agreements are handled directly between buyers and sellers. BUYLOG provides the space for marketplace interactions but does not process payments or manage agreements.",
  },
  {
    id: 5,
    question: "How can I become a seller on BUYLOG?",
    answer:
      "Anyone can become a seller by registering an account and creating marketplace listings. Sellers manage their own offerings and business operations while using BUYLOG to reach potential customers.",
  },
  {
    id: 6,
    question: "How does marketplace communication work?",
    answer:
      "BUYLOG enables communication between buyers and sellers so they can discuss product details or business opportunities. This promotes transparency and direct marketplace interactions.",
  },
  {
    id: 7,
    question: "What kinds of listings are allowed?",
    answer:
      "Sellers may list products or services that comply with marketplace guidelines. Listings should accurately represent what is being offered to help buyers make informed decisions.",
  },
  {
    id: 8,
    question: "How can I get support?",
    answer:
      "Support is available through the marketplace help center and contact options. Our team assists with platform usage and marketplace-related inquiries.",
  },
];

export default function Faq() {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleAccordionClick = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="bg-primaryColor dark:bg-white">
      <div className="h-full px-4 py-[8rem] mx-auto md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:gap-12 lg:grid-cols-3">

          {/* FAQ Heading */}
          <div className="text-center lg:text-left">
            <p className="text-4xl font-semibold tracking-tighter dark:text-black text-white">
              Marketplace Frequently Asked Questions
            </p>
            <p className="text-base mt-4 dark:text-zinc-900 text-zinc-300">
              Learn how the marketplace works and how it connects buyers and sellers.
            </p>
          </div>

          {/* Accordion List */}
          <div className="relative w-full mx-auto font-normal lg:col-span-2">
            {faqData.map((faqItem) => (
              <div
                key={faqItem.id}
                className="cursor-pointer group text-slate-50 dark:text-black"
              >
                <button
                  className="flex items-center justify-between w-full p-4 pb-1 text-sm text-left lg:text-base"
                  onClick={() => handleAccordionClick(faqItem.id)}
                >
                  <span className="font-semibold">{faqItem.question}</span>
                  {activeAccordion === faqItem.id ? (
                    <GoDash className="w-5 h-5" />
                  ) : (
                    <GoPlus className="w-5 h-5" />
                  )}
                </button>

                {activeAccordion === faqItem.id && (
                  <div className="p-4 pt-2 text-lg text-gray-300 dark:text-zinc-900">
                    {faqItem.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}