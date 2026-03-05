import React from "react";

const brands = [
  "Samsung",
  "Apple",
  "Xiaomi",
  "Huawei",
  "Tecno",
  "Infinix",
  "Nokia",
  "Sony",
  "LG",
  "HP",
  "Dell",
];

export default function BrandFilter() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">

      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Brand
      </h2>

      <div className="space-y-2 max-h-48 overflow-y-auto">

        {brands.map((brand) => (
          <label
            key={brand}
            className="flex items-center space-x-2 text-slate-700 dark:text-slate-300"
          >
            <input
              type="checkbox"
              className="form-checkbox text-green-600"
              value={brand}
            />
            <span>{brand}</span>
          </label>
        ))}

      </div>
    </div>
  );
}