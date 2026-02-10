"use client";

import Link from "next/link";
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
  car: <FaCar size={28} />,
  house: <FaHome size={28} />,
  property: <FaBuilding size={28} />,
  gadgets: <FaLaptop size={28} />,
  electronics: <FaMobileAlt size={28} />,
  furniture: <FaCouch size={28} />,
  fashion: <FaTshirt size={28} />,
  beauty: <FaSpa size={28} />,
  kids: <FaBaby size={28} />,
  food: <FaPizzaSlice size={28} />,
  livestock: <FaDrumstickBite size={28} />,
  services: <FaHandsHelping size={28} />,
  jobs: <FaBriefcase size={28} />,
};

export default function CategoryGrid({ categories = [] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 py-6">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug || cat.id}`}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border hover:shadow-md transition bg-white"
        >
          <div className="text-purple-600">
            {ICONS_MAP[cat.iconKey] || <span className="text-2xl">📦</span>}
          </div>
          <span className="text-xs font-medium text-center">
            {cat.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
