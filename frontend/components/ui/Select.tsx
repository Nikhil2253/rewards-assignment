import type { SelectHTMLAttributes } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: SelectOption[];
  error?: string;
};

export default function Select({
  label,
  options,
  error,
  className = "",
  id,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <select
        id={id}
        className={`h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          disabled:cursor-not-allowed disabled:bg-gray-100
          ${error ? "border-red-500" : ""}
          ${className}`}
        {...props}
      >
        <option value="">Select...</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}