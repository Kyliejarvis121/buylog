"use client";
import { useState } from "react";
import { GoPlus, GoDash } from "react-icons/go";

const faqData = [
  {
    id: 1,
    question: "What is BUYLOG?",
    answer:
      "BUYLOG is a marketplace that connects buyers and sellers. Sellers can list products, and buyers can discover and contact sellers directly. Our goal is to enable seamless marketplace interactions and business opportunities.",
  },
  {
    id: 2,
    question: "How does BUYLOG help sellers?",
    answer:
      "BUYLOG provides a platform where sellers can showcase their products and reach potential customers. Sellers manage their own listings and business interactions while BUYLOG facilitates discovery and connection.",
  },
  {
    id: 3,
    question: "How does BUYLOG help buyers?",
    answer:
      "BUYLOG allows buyers to browse products from different sellers and connect with them. Buyers can explore options and communicate with sellers to inquire about products and services.",
  },
  {
    id: 4,
    question: "Is BUYLOG responsible for transactions?",
    answer:
      "No. BUYLOG is a marketplace platform that connects buyers and sellers. Transactions and agreements are handled directly between users, while BUYLOG provides the space for marketplace interactions.",
  },
  {
    id: 5,
    question: "How can I become a seller?",
    answer:
      "Anyone can become a seller by registering an account and creating listings. Sellers manage their own products and business operations while using BUYLOG as a marketplace to reach customers.",
  },
  {
    id: 6,
    question: "How does marketplace communication work?",
    answer:
      "BUYLOG enables communication between buyers and sellers so they can discuss product details and business opportunities. This helps create transparent and direct marketplace interactions.",
  },
  {
    id: 7,
    question: "What kinds of products can be listed?",
    answer:
      "Sellers can list products that comply with marketplace guidelines. Listings should accurately represent what is being offered to help buyers make informed decisions.",
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