export default function TextInput({
  label,
  name,
  register,
  errors,
  isRequired = true,
  type = "text",
  className = "sm:col-span-2",
  defaultValue = "",
  placeholder,
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100 mb-2"
      >
        {label}
      </label>

      <div className="mt-1">
        <input
          {...register(name, { required: isRequired })}
          type={type}
          id={name}
          name={name}
          defaultValue={defaultValue}
          autoComplete={name}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className="
            block w-full rounded-md
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            shadow-sm
            focus:ring-2 focus:ring-lime-600 dark:focus:ring-slate-500
            focus:border-transparent
            sm:text-sm sm:leading-6
            px-3 py-2
          "
        />

        {errors?.[name] && (
          <span className="text-sm text-red-600 dark:text-red-400">
            {label} is required
          </span>
        )}
      </div>
    </div>
  );
}