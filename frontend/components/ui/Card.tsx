import type { HTMLAttributes, ReactNode } from "react";
import { colors, radius, shadow } from "@/lib/tokens";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function Card({
  children,
  className = "",
  style,
  ...props
}: CardProps) {
  return (
    <div
      className={`p-5 ${className}`}
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
        boxShadow: shadow.sm,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}