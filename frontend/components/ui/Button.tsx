import type { ButtonHTMLAttributes, ReactNode } from "react";
import { colors, radius, typography } from "@/lib/tokens";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  style,
  disabled,
  ...props
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center gap-2 transition-all duration-150 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyles: Record<typeof variant, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${colors.sidebarGradientStart}, ${colors.sidebarGradientEnd})`,
      color: colors.surface,
      border: "1px solid transparent",
      boxShadow: disabled ? "none" : "0 4px 12px rgba(180,35,47,0.22)",
    },
    secondary: {
      backgroundColor: colors.surfaceHover,
      color: colors.textPrimary,
      border: `1px solid ${colors.border}`,
    },
    danger: {
      backgroundColor: colors.danger,
      color: colors.surface,
      border: "1px solid transparent",
    },
    ghost: {
      backgroundColor: "transparent",
      color: colors.textSecondary,
      border: "1px solid transparent",
    },
  };

  return (
    <button
      className={`${baseClass} ${className}`}
      style={{
        borderRadius: radius.md,
        padding: "9px 16px",
        fontFamily: typography.fontBody,
        fontSize: typography.size.sm,
        fontWeight: typography.weight.semibold,
        ...variantStyles[variant],
        ...style,
      }}
      disabled={disabled}
      onMouseEnter={(event) => {
        if (disabled) return;
        if (variant === "primary") {
          event.currentTarget.style.boxShadow =
            "0 6px 18px rgba(180,35,47,0.32)";
          event.currentTarget.style.filter = "brightness(1.04)";
        } else if (variant === "secondary") {
          event.currentTarget.style.backgroundColor = colors.border;
        } else if (variant === "danger") {
          event.currentTarget.style.backgroundColor = colors.dangerMuted;
          event.currentTarget.style.color = colors.danger;
        } else if (variant === "ghost") {
          event.currentTarget.style.backgroundColor = colors.surfaceHover;
          event.currentTarget.style.color = colors.textPrimary;
        }
      }}
      onMouseLeave={(event) => {
        if (disabled) return;
        if (variant === "primary") {
          event.currentTarget.style.boxShadow =
            "0 4px 12px rgba(180,35,47,0.22)";
          event.currentTarget.style.filter = "none";
        } else if (variant === "secondary") {
          event.currentTarget.style.backgroundColor = colors.surfaceHover;
        } else if (variant === "danger") {
          event.currentTarget.style.backgroundColor = colors.danger;
          event.currentTarget.style.color = colors.surface;
        } else if (variant === "ghost") {
          event.currentTarget.style.backgroundColor = "transparent";
          event.currentTarget.style.color = colors.textSecondary;
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}