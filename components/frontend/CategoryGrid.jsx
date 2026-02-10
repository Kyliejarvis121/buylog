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
  
  export default function CategoryGrid({ categories = [], onSelectCategory }) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id || cat.name}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onSelectCategory(cat.name)}
            >
              <div className="bg-gray-100 p-3 rounded-full w-16 h-16 flex items-center justify-center text-purple-600 text-2xl">
                {ICONS_MAP[cat.name] || <span>📦</span>}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700 text-center">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  