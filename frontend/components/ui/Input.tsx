import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
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

      <input
        id={id}
        className={`h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition
          placeholder:text-gray-400
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
          ${className}`}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}