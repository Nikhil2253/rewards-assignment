"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { colors, radius, shadow, typography } from "@/lib/tokens";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
};

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "All",
  error,
  disabled,
  id,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const isActive = focused || open;
  const borderColor = error
    ? colors.danger
    : isActive
      ? colors.primary
      : colors.border;

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
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

      <div className="relative">
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex h-10 w-full items-center justify-between outline-none transition-colors duration-150"
          style={{
            borderRadius: radius.md,
            border: `1px solid ${borderColor}`,
            backgroundColor: disabled ? colors.surfaceHover : colors.surface,
            color: selected ? colors.textPrimary : colors.textMuted,
            fontFamily: typography.fontBody,
            fontSize: typography.size.base,
            padding: "0 12px",
            boxShadow: isActive
              ? `0 0 0 1px ${error ? colors.dangerMuted : colors.primaryMuted}`
              : shadow.sm,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <span className="truncate">
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            strokeWidth={2.25}
            color={colors.textMuted}
            style={{
              transition: "transform 150ms ease",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              flexShrink: 0,
              marginLeft: "8px",
            }}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute left-0 right-0 z-20 mt-1.5 max-h-60 overflow-y-auto p-1"
            style={{
              borderRadius: radius.md,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
              boxShadow: shadow.md,
            }}
          >
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors duration-150"
              style={{
                borderRadius: radius.sm,
                backgroundColor:
                  value === "" ? colors.primaryMuted : "transparent",
                color: value === "" ? colors.primary : colors.textSecondary,
                fontFamily: typography.fontBody,
                fontSize: typography.size.base,
                fontWeight:
                  value === ""
                    ? typography.weight.medium
                    : typography.weight.regular,
              }}
              onMouseEnter={(event) => {
                if (value !== "") {
                  event.currentTarget.style.backgroundColor =
                    colors.surfaceHover;
                }
              }}
              onMouseLeave={(event) => {
                if (value !== "") {
                  event.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <span>{placeholder}</span>
            </button>

            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors duration-150"
                  style={{
                    borderRadius: radius.sm,
                    backgroundColor: isSelected
                      ? colors.primaryMuted
                      : "transparent",
                    color: isSelected ? colors.primary : colors.textPrimary,
                    fontFamily: typography.fontBody,
                    fontSize: typography.size.base,
                    fontWeight: isSelected
                      ? typography.weight.medium
                      : typography.weight.regular,
                  }}
                  onMouseEnter={(event) => {
                    if (!isSelected) {
                      event.currentTarget.style.backgroundColor =
                        colors.surfaceHover;
                    }
                  }}
                  onMouseLeave={(event) => {
                    if (!isSelected) {
                      event.currentTarget.style.backgroundColor =
                        "transparent";
                    }
                  }}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check size={14} strokeWidth={2.5} color={colors.primary} />
                  )}
                </button>
              );
            })}
          </div>
        )}
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