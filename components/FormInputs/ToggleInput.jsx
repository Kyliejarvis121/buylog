import React from "react";

export default function ToggleInput({
  label,
  name,
  trueTitle,
  falseTitle,
  register,
  watch,
  className = "sm:col-span-2 flex flex-wrap",
}) {
  const value = watch ? watch(name) : false;

  return (
    <div className={className}>
      {/* Label */}
      <div className="w-full sm:w-1/2">
        <h2 className="mb-2 text-sm font-medium leading-6 text-gray-900 dark:text-slate-50">
          {label}
        </h2>
      </div>

      {/* Toggle */}
      <div className="w-full sm:w-1/2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            {...register(name)}
            type="checkbox"
            className="sr-only peer"
          />

          <div
            className="
              w-11 h-6 rounded-full
              bg-gray-200 dark:bg-gray-700
              peer-focus:outline-none
              peer-focus:ring-4
              peer-focus:ring-purple-300
              dark:peer-focus:ring-purple-800
              peer-checked:bg-purple-600
              after:content-['']
              after:absolute
              after:top-[2px]
              after:left-[2px]
              after:h-5
              after:w-5
              after:rounded-full
              after:border
              after:border-gray-300
              after:bg-white
              after:transition-all
              peer-checked:after:translate-x-full
              peer-checked:after:border-white
            "
          />

          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {value ? trueTitle : falseTitle}
          </span>
        </label>
      </div>
    </div>
  );
}