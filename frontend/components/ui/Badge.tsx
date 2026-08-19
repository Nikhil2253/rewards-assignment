import { colors } from "@/lib/tokens";
import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "info";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  const variants: Record<
  BadgeVariant,
  { backgroundColor: string; color: string }
> = {
  success: {
    backgroundColor: colors.successMuted,
    color: colors.success,
  },
  warning: {
    backgroundColor: colors.warningMuted,
    color: colors.warning,
  },
  danger: {
    backgroundColor: colors.dangerMuted,
    color: colors.danger,
  },
  neutral: {
    backgroundColor: colors.border,
    color: colors.textSecondary,
  },
  info: {
    backgroundColor: colors.primaryMuted,
    color: colors.primary,
  },
};

  return (
    <span
  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
  style={variants[variant]}
  {...props}
>
  {children}
</span>
  );
}