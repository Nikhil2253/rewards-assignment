"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { colors, radius, shadow, typography } from "@/lib/tokens";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: ReactNode;
};

export default function Input({
  label,
  error,
  icon,
  className = "",
  id,
  style,
  disabled,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.danger
    : focused
      ? colors.primary
      : colors.border;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          style={{
            color: colors.textSecondary,
            fontFamily: typography.fontBody,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.medium,
          }}
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <span
            className="pointer-events-none absolute left-3 flex items-center"
            style={{ color: focused ? colors.primary : colors.textMuted }}
          >
            {icon}
          </span>
        )}

        <input
          id={id}
          disabled={disabled}
          className={`h-10 w-full outline-none transition-colors duration-150 ${className}`}
          style={{
            borderRadius: radius.md,
            border: `1px solid ${borderColor}`,
            backgroundColor: disabled ? colors.surfaceHover : colors.surface,
            color: disabled ? colors.textMuted : colors.textPrimary,
            fontFamily: typography.fontBody,
            fontSize: typography.size.base,
            paddingLeft: icon ? "36px" : "12px",
            paddingRight: "12px",
            boxShadow: focused
              ? `0 0 0 1px ${error ? colors.dangerMuted : colors.primaryMuted}`
              : shadow.sm,
            cursor: disabled ? "not-allowed" : "text",
            ...style,
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...props}
        />
      </div>

      {error && (
        <p
          style={{
            color: colors.danger,
            fontFamily: typography.fontBody,
            fontSize: typography.size.xs,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}