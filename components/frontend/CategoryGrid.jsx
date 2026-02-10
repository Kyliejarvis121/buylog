"use client";

import { useRouter } from "next/navigation";
import {
  FaCar,
  FaHome,
  FaBuilding,
  FaLaptop,
  FaMobileAlt,
  FaCouch,
  FaTshirt,
  FaSpa,
  FaBaby,
  FaPizzaSlice,
  FaDrumstickBite,
  FaHandsHelping,
  FaBriefcase,
} from "react-icons/fa";

const ICONS_MAP = {
  "Car": <FaCar />,
  "House": <FaHome />,
  "Property": <FaBuilding />,
  "Gadgets": <FaLaptop />,
  "Electronics": <FaMobileAlt />,
  "Home Interiors & Furniture": <FaCouch />,
  "Clothes & Shoes": <FaTshirt />,
  "Beauty Tools": <FaSpa />,
  "Kids Items": <FaBaby />,
  "Food Items": <FaPizzaSlice />,
  "Livestock": <FaDrumstickBite />,
  "Service Rendering": <FaHandsHelping />,
  "Job Offers": <FaBriefcase />,
};

export default function CategoryGrid({ categories = [] }) {
  const router = useRouter();

  const handleClick = (name) => {
    router.push(`/products?category=${encodeURIComponent(name)}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id || cat.name}
            onClick={() => handleClick(cat.name)}
            className="flex flex-col items-center hover:scale-105 transition-transform"
          >
            <div className="bg-gray-100 p-3 rounded-full w-16 h-16 flex items-center justify-center text-purple-600 text-2xl">
              {ICONS_MAP[cat.name] || <span>📦</span>}
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700 text-center">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
