"use client";

import { useState, type ReactNode } from "react";
import { AlertCircle, ChevronRight, Inbox, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { colors, radius, shadow, typography } from "@/lib/tokens";

export type TableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (columnKey: string) => void;

  loading?: boolean;
  error?: string;
  emptyMessage?: string;
};

const SKELETON_ROWS = 6;
const SKELETON_WIDTHS = ["70%", "55%", "45%", "60%", "50%", "40%"];

export default function Table<T>({
  columns,
  data,
  getRowKey,
  onRowClick,
  sortBy,
  sortOrder,
  onSortChange,
  loading = false,
  error,
  emptyMessage = "No data found.",
}: TableProps<T>) {
  const [activeKey, setActiveKey] = useState<string | number | null>(null);
  const columnCount = columns.length + (onRowClick ? 1 : 0);

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
        boxShadow: shadow.sm,
      }}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead
            className="sticky top-0 z-10"
            style={{ backgroundColor: colors.background }}
          >
            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
              {columns.map((column) => {
                const isSortable = column.sortable && onSortChange;
                const isActiveSort = sortBy === column.key;

                return (
                  <th
                    key={column.key}
                    className="whitespace-nowrap px-4 py-3"
                    style={{
                      fontFamily: typography.fontBody,
                      fontSize: typography.size.xs,
                      fontWeight: typography.weight.semibold,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: isActiveSort ? colors.textPrimary : colors.textMuted,
                    }}
                    aria-sort={
                      isActiveSort
                        ? sortOrder === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => onSortChange!(column.key)}
                        className="inline-flex items-center gap-1 outline-none"
                        style={{
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          fontWeight: "inherit",
                          textTransform: "inherit",
                          letterSpacing: "inherit",
                          color: "inherit",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.textPrimary;
                        }}
                        onMouseLeave={(e) => {
                          if (!isActiveSort) {
                            e.currentTarget.style.color = colors.textMuted;
                          }
                        }}
                      >
                        {column.header}
                        {isActiveSort ? (
                          sortOrder === "asc" ? (
                            <ChevronUp size={13} strokeWidth={2.5} color={colors.primary} />
                          ) : (
                            <ChevronDown size={13} strokeWidth={2.5} color={colors.primary} />
                          )
                        ) : (
                          <ChevronsUpDown size={13} strokeWidth={2} style={{ opacity: 0.4 }} />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
              {onRowClick && <th className="w-10 px-2" aria-hidden />}
            </tr>
          </thead>

          <tbody>
            {loading &&
              Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
                <tr
                  key={`skeleton-${rowIndex}`}
                  style={{ borderBottom: `1px solid ${colors.border}` }}
                >
                  {columns.map((column, colIndex) => (
                    <td key={column.key} className="px-4 py-3.5">
                      <div
                        className="animate-pulse"
                        style={{
                          height: "12px",
                          width:
                            SKELETON_WIDTHS[
                              (colIndex + rowIndex) % SKELETON_WIDTHS.length
                            ],
                          borderRadius: radius.sm,
                          backgroundColor: colors.border,
                        }}
                      />
                    </td>
                  ))}
                  {onRowClick && <td className="px-2" />}
                </tr>
              ))}

            {!loading && error && (
              <tr>
                <td colSpan={columnCount} className="px-4 py-14">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.dangerMuted }}
                    >
                      <AlertCircle
                        size={18}
                        strokeWidth={2.25}
                        color={colors.danger}
                      />
                    </div>
                    <p
                      style={{
                        fontFamily: typography.fontBody,
                        fontSize: typography.size.sm,
                        fontWeight: typography.weight.medium,
                        color: colors.textPrimary,
                      }}
                    >
                      {error}
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan={columnCount} className="px-4 py-14">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.primaryMuted }}
                    >
                      <Inbox size={18} strokeWidth={2} color={colors.primary} />
                    </div>
                    <p
                      style={{
                        fontFamily: typography.fontBody,
                        fontSize: typography.size.sm,
                        color: colors.textMuted,
                      }}
                    >
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              data.map((row, index) => {
                const key = getRowKey(row, index);
                const isActive = activeKey === key;

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row)}
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={(event) => {
                      if (
                        onRowClick &&
                        (event.key === "Enter" || event.key === " ")
                      ) {
                        event.preventDefault();
                        onRowClick(row);
                      }
                    }}
                    onMouseEnter={() => onRowClick && setActiveKey(key)}
                    onMouseLeave={() =>
                      setActiveKey((current) => (current === key ? null : current))
                    }
                    onFocus={() => onRowClick && setActiveKey(key)}
                    onBlur={() =>
                      setActiveKey((current) => (current === key ? null : current))
                    }
                    className={`last:border-b-0 transition-colors duration-150 ${
                      onRowClick ? "cursor-pointer outline-none" : ""
                    }`}
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      backgroundColor: isActive
                        ? colors.surfaceHover
                        : index % 2 === 1
                          ? colors.background
                          : "transparent",
                    }}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={column.key}
                        className="whitespace-nowrap px-4 py-3"
                        style={{
                          fontFamily: typography.fontBody,
                          fontSize: typography.size.sm,
                          color: colors.textSecondary,
                          boxShadow:
                            colIndex === 0 && isActive
                              ? `inset 3px 0 0 0 ${colors.primary}`
                              : undefined,
                        }}
                      >
                        {column.render(row)}
                      </td>
                    ))}

                    {onRowClick && (
                      <td className="px-2">
                        <ChevronRight
                          size={16}
                          strokeWidth={2.25}
                          color={colors.primary}
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: isActive
                              ? "translateX(0)"
                              : "translateX(-4px)",
                            transition:
                              "opacity 150ms ease, transform 150ms ease",
                          }}
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}