"use client";

import { useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  PieChart as PieChartIcon,
  UtensilsCrossed,
  ShoppingCart,
  Car,
  Film,
  Receipt,
  HeartPulse,
  Home,
  Plane,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { colors, radius, shadow, typography } from "@/lib/tokens";

type CategorySpending = {
  category: string;
  amount: number;
};

type SpendingByCategoryProps = {
  data: CategorySpending[];
  onCategoryClick: (category: string) => void;
};

// Brand-derived palette instead of a generic chart-library gray/rainbow
// set — every slice reads as "this app," not "a chart library default."
const PALETTE = [
  colors.sidebarGradientStart,
  colors.accent,
  colors.sidebarGradientEnd,
  "#E0A83D",
  "#8C6B70",
  colors.textMuted,
];

// When one category dwarfs the rest, a plain value-proportional pie makes
// the smaller slices collapse into sub-degree slivers that don't render
// legibly (or at all). We give every slice a minimum share of the circle
// for drawing purposes only — the tooltip, legend %, and center total all
// still use the real `amount`, so no data is changed, only how skewed
// values are laid out on the ring.
const MIN_SLICE_SHARE = 0.035;

// Full-precision totals (₹1,06,94,91,269.39) are wider than the donut's
// hole and spill out over the ring. Compact-format for display there;
// the exact figure is still available via the title attribute on hover.
function formatCompactCurrency(value: number) {
  return `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;
}

function formatFullCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function getCategoryIcon(category: string): LucideIcon {
  const text = category.toLowerCase();

  if (/(food|dining|restaurant|eat)/.test(text)) return UtensilsCrossed;
  if (/(grocer|market)/.test(text)) return ShoppingCart;
  if (/(transport|fuel|gas|taxi|cab|ride)/.test(text)) return Car;
  if (/(entertain|movie|stream|music)/.test(text)) return Film;
  if (/(bill|utilit|subscription)/.test(text)) return Receipt;
  if (/(health|medical|pharma)/.test(text)) return HeartPulse;
  if (/(rent|home|housing)/.test(text)) return Home;
  if (/(travel|flight|hotel|trip)/.test(text)) return Plane;

  return Tag;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  const realAmount = entry.payload?.amount ?? entry.value;

  return (
    <div
      className="px-3 py-2"
      style={{
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadow.md,
      }}
    >
      <p
        style={{
          color: colors.textPrimary,
          fontFamily: typography.fontBody,
          fontSize: typography.size.xs,
          fontWeight: typography.weight.semibold,
        }}
      >
        {entry.name}
      </p>
      <p
        style={{
          color: colors.textMuted,
          fontFamily: typography.fontBody,
          fontSize: typography.size.xs,
          marginTop: "1px",
        }}
      >
        ₹{Number(realAmount).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export default function SpendingByCategory({
  data,
  onCategoryClick,
}: SpendingByCategoryProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.amount, 0),
    [data]
  );

  // Chart-only values: each slice gets at least MIN_SLICE_SHARE of the
  // ring, and the remaining space is split by real proportion. Falls back
  // to plain proportions if there are too many categories to reserve a
  // minimum for each.
  const chartData = useMemo(() => {
    if (total <= 0) return data.map((item) => ({ ...item, visualAmount: 1 }));

    const reserved = MIN_SLICE_SHARE * data.length;
    if (reserved >= 1) {
      return data.map((item) => ({ ...item, visualAmount: item.amount }));
    }

    const remaining = 1 - reserved;
    return data.map((item) => ({
      ...item,
      visualAmount: MIN_SLICE_SHARE + (item.amount / total) * remaining,
    }));
  }, [data, total]);

  if (data.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-3 p-10 text-center"
        style={{
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primaryMuted }}
        >
          <PieChartIcon size={18} strokeWidth={2} color={colors.primary} />
        </div>
        <p
          style={{
            color: colors.textMuted,
            fontFamily: typography.fontBody,
            fontSize: typography.size.sm,
          }}
        >
          No category spending to show yet.
        </p>
      </div>
    );
  }

  return (
    <section
      className="p-5"
      style={{
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadow.sm,
      }}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center"
          style={{
            borderRadius: radius.sm,
            backgroundColor: colors.primaryMuted,
          }}
        >
          <PieChartIcon size={15} strokeWidth={2.25} color={colors.primary} />
        </div>
        <div>
          <h3
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fontDisplay,
              fontSize: typography.size.base,
              fontWeight: typography.weight.semibold,
              letterSpacing: "-0.01em",
            }}
          >
            Spending by category
          </h3>
          <p
            style={{
              color: colors.textMuted,
              fontFamily: typography.fontBody,
              fontSize: typography.size.xs,
            }}
          >
            Tap a slice to filter transactions
          </p>
        </div>
      </div>

      <div className="relative h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="visualAmount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={68}
              paddingAngle={3}
              cornerRadius={6}
              onClick={(entry) => onCategoryClick(entry.category)}
              onMouseEnter={(entry) => setHovered(entry.category)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer", outline: "none" }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.category}
                  fill={PALETTE[index % PALETTE.length]}
                  opacity={
                    hovered && hovered !== entry.category ? 0.35 : 1
                  }
                  style={{ transition: "opacity 150ms ease" }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Total, centered inside the donut hole */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p
            style={{
              color: colors.textMuted,
              fontFamily: typography.fontBody,
              fontSize: typography.size.xs,
            }}
          >
            Total
          </p>
          <p
            title={formatFullCurrency(total)}
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fontDisplay,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
              maxWidth: "120px",
              overflowWrap: "break-word",
            }}
          >
            {formatCompactCurrency(total)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item, index) => {
          const Icon = getCategoryIcon(item.category);
          const share = total > 0 ? Math.round((item.amount / total) * 100) : 0;

          return (
            <button
              key={item.category}
              type="button"
              onClick={() => onCategoryClick(item.category)}
              onMouseEnter={() => setHovered(item.category)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center gap-2.5 p-2 text-left transition-colors duration-150"
              style={{
                borderRadius: radius.md,
                backgroundColor:
                  hovered === item.category ? colors.surfaceHover : "transparent",
              }}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `${PALETTE[index % PALETTE.length]}1F`,
                }}
              >
                <Icon
                  size={13}
                  strokeWidth={2.25}
                  color={PALETTE[index % PALETTE.length]}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="truncate"
                  style={{
                    color: colors.textPrimary,
                    fontFamily: typography.fontBody,
                    fontSize: typography.size.sm,
                    fontWeight: typography.weight.medium,
                  }}
                >
                  {item.category}
                </p>
              </div>

              <span
                style={{
                  color: colors.textMuted,
                  fontFamily: typography.fontBody,
                  fontSize: typography.size.xs,
                  fontWeight: typography.weight.medium,
                }}
              >
                {share}%
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}