"use client";

import type { CSSProperties } from "react";
import { colors, radius, typography } from "@/lib/tokens";

type TransactionPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function TransactionPagination({
  page,
  totalPages,
  onPageChange,
}: TransactionPaginationProps) {
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const pages = getPages();

  const navButtonStyle: CSSProperties = {
    borderRadius: radius.md,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.surface,
    color: colors.textSecondary,
    fontFamily: typography.fontBody,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
    padding: "8px 14px",
    transition: "background-color 150ms ease",
  };

  const pageButtonStyle = (active: boolean): CSSProperties =>
    active
      ? {
          borderRadius: radius.md,
          border: "1px solid transparent",
          background: `linear-gradient(135deg, ${colors.sidebarGradientStart}, ${colors.sidebarGradientEnd})`,
          color: colors.surface,
          fontFamily: typography.fontBody,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.semibold,
          padding: "8px 13px",
          boxShadow: "0 4px 12px rgba(180,35,47,0.22)",
        }
      : {
          borderRadius: radius.md,
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.surface,
          color: colors.textSecondary,
          fontFamily: typography.fontBody,
          fontSize: typography.size.sm,
          fontWeight: typography.weight.medium,
          padding: "8px 13px",
          transition: "background-color 150ms ease",
        };

  return (
    <div className="mt-4 flex items-center justify-center gap-1.5">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="disabled:cursor-not-allowed disabled:opacity-50"
        style={navButtonStyle}
        onMouseEnter={(event) => {
          if (page !== 1) {
            event.currentTarget.style.backgroundColor = colors.surfaceHover;
          }
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = colors.surface;
        }}
      >
        Previous
      </button>

      {pages.map((pageNumber, index) =>
        pageNumber === "..." ? (
          <span
            key={`ellipsis-${index}`}
            style={{
              padding: "8px 6px",
              fontFamily: typography.fontBody,
              fontSize: typography.size.sm,
              color: colors.textMuted,
            }}
          >
            ...
          </span>
        ) : (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            style={pageButtonStyle(page === pageNumber)}
            onMouseEnter={(event) => {
              if (page !== pageNumber) {
                event.currentTarget.style.backgroundColor = colors.surfaceHover;
              }
            }}
            onMouseLeave={(event) => {
              if (page !== pageNumber) {
                event.currentTarget.style.backgroundColor = colors.surface;
              }
            }}
          >
            {pageNumber}
          </button>
        )
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="disabled:cursor-not-allowed disabled:opacity-50"
        style={navButtonStyle}
        onMouseEnter={(event) => {
          if (page !== totalPages) {
            event.currentTarget.style.backgroundColor = colors.surfaceHover;
          }
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.backgroundColor = colors.surface;
        }}
      >
        Next
      </button>
    </div>
  );
}