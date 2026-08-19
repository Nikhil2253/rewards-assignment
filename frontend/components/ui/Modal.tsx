"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { colors, radius, shadow, typography } from "@/lib/tokens";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(43,17,22,0.45)",
        backdropFilter: "blur(3px)",
        animation: "rewarder-modal-fade 160ms ease-out",
      }}
      onMouseDown={onClose}
    >
      <style>{`
        @keyframes rewarder-modal-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes rewarder-modal-scale {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className="w-full max-w-md"
        style={{
          borderRadius: radius.sm,
          backgroundColor: colors.surface,
          boxShadow: shadow.lg,
          border: `1px solid ${colors.border}`,
          animation: "rewarder-modal-scale 180ms ease-out",
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          {title && (
            <h2
              id="modal-title"
              style={{
                color: colors.textPrimary,
                fontFamily: typography.fontDisplay,
                fontSize: typography.size.md,
                fontWeight: typography.weight.semibold,
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </h2>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center transition-colors duration-150"
            style={{
              borderRadius: radius.sm,
              color: colors.textMuted,
              backgroundColor: "transparent",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = colors.surfaceHover;
              event.currentTarget.style.color = colors.textPrimary;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = "transparent";
              event.currentTarget.style.color = colors.textMuted;
            }}
          >
            <X size={16} strokeWidth={2.25} />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}