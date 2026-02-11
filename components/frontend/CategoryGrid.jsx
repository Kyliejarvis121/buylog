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
  car: <FaCar size={22} />,
  house: <FaHome size={22} />,
  property: <FaBuilding size={22} />,
  gadgets: <FaLaptop size={22} />,
  electronics: <FaMobileAlt size={22} />,
  furniture: <FaCouch size={22} />,
  fashion: <FaTshirt size={22} />,
  beauty: <FaSpa size={22} />,
  kids: <FaBaby size={22} />,
  food: <FaPizzaSlice size={22} />,
  livestock: <FaDrumstickBite size={22} />,
  services: <FaHandsHelping size={22} />,
  jobs: <FaBriefcase size={22} />,
};

export default function CategoryGrid({ categories = [] }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3 px-3 py-4">
      {categories.map((cat) => {
        const icon = ICONS_MAP[cat.iconKey] || <span className="text-lg">📦</span>;
        const label = cat.name || cat.title; // supports both

        return (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg border hover:shadow-sm transition bg-white"
          >
            <div className="text-purple-600">{icon}</div>
            <span className="text-[11px] font-medium text-center leading-tight">
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
