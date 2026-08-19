"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  LineChart as LineChartIcon,
} from "lucide-react";
import { colors, radius, shadow, typography } from "@/lib/tokens";

type MonthlySpendingData = {
  month: string;
  amount: number;
};

type MonthlySpendingTrendProps = {
  data: MonthlySpendingData[];
};

// Reuse the sidebar's flame-red for "spending went up" and a settled green
// for "spending went down" — keeps the signal tied to the app's own palette
// instead of a generic traffic-light red/green.
const INCREASE_COLOR = colors.sidebarGradientStart;
const DECREASE_COLOR = "#0E6E55";

function formatCurrency(value: number) {
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

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
        {label}
      </p>
      <p
        style={{
          color: colors.textMuted,
          fontFamily: typography.fontBody,
          fontSize: typography.size.xs,
          marginTop: "1px",
        }}
      >
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export default function MonthlySpendingTrend({
  data,
}: MonthlySpendingTrendProps) {
  const { total, average, changePercent, isIncrease, hasChange } =
    useMemo(() => {
      const total = data.reduce((sum, item) => sum + item.amount, 0);
      const average = data.length > 0 ? total / data.length : 0;

      let changePercent = 0;
      let isIncrease = false;
      let hasChange = false;

      if (data.length >= 2) {
        const previous = data[data.length - 2].amount;
        const latest = data[data.length - 1].amount;

        if (previous > 0) {
          changePercent = ((latest - previous) / previous) * 100;
          isIncrease = latest >= previous;
          hasChange = true;
        }
      }

      return { total, average, changePercent, isIncrease, hasChange };
    }, [data]);

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
          <LineChartIcon size={18} strokeWidth={2} color={colors.primary} />
        </div>
        <p
          style={{
            color: colors.textMuted,
            fontFamily: typography.fontBody,
            fontSize: typography.size.sm,
          }}
        >
          No monthly spending to show yet.
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
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center"
            style={{
              borderRadius: radius.sm,
              backgroundColor: colors.primaryMuted,
            }}
          >
            <LineChartIcon
              size={15}
              strokeWidth={2.25}
              color={colors.primary}
            />
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
              Monthly spending trend
            </h3>
            <p
              style={{
                color: colors.textMuted,
                fontFamily: typography.fontBody,
                fontSize: typography.size.xs,
              }}
            >
              Track your spending over time
            </p>
          </div>
        </div>

        {hasChange && (
          <div
            className="flex items-center gap-1 px-2.5 py-1"
            style={{
              borderRadius: radius.full,
              backgroundColor: isIncrease
                ? "rgba(180,35,47,0.08)"
                : "rgba(14,110,85,0.08)",
            }}
          >
            {isIncrease ? (
              <TrendingUp size={13} strokeWidth={2.5} color={INCREASE_COLOR} />
            ) : (
              <TrendingDown
                size={13}
                strokeWidth={2.5}
                color={DECREASE_COLOR}
              />
            )}
            <span
              style={{
                color: isIncrease ? INCREASE_COLOR : DECREASE_COLOR,
                fontFamily: typography.fontBody,
                fontSize: typography.size.xs,
                fontWeight: typography.weight.semibold,
              }}
            >
              {Math.abs(changePercent).toFixed(1)}% vs last month
            </span>
          </div>
        )}
      </div>

      {/* Quick stats strip */}
      <div className="mb-5 flex items-center gap-6">
        <div>
          <p
            style={{
              color: colors.textMuted,
              fontFamily: typography.fontBody,
              fontSize: typography.size.xs,
            }}
          >
            Total spent
          </p>
          <p
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fontDisplay,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              letterSpacing: "-0.01em",
              marginTop: "2px",
            }}
          >
            {formatCurrency(total)}
          </p>
        </div>

        <div
          style={{ width: "1px", height: "32px", backgroundColor: colors.border }}
        />

        <div>
          <p
            style={{
              color: colors.textMuted,
              fontFamily: typography.fontBody,
              fontSize: typography.size.xs,
            }}
          >
            Monthly average
          </p>
          <p
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fontDisplay,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              letterSpacing: "-0.01em",
              marginTop: "2px",
            }}
          >
            {formatCurrency(average)}
          </p>
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="monthlySpendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.primary} stopOpacity={0.28} />
                <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.border}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{
                fontSize: 12,
                fill: colors.textMuted,
                fontFamily: typography.fontBody,
              }}
              axisLine={{ stroke: colors.border }}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 12,
                fill: colors.textMuted,
                fontFamily: typography.fontBody,
              }}
              axisLine={false}
              tickLine={false}
              width={72}
              tickFormatter={(value) => formatCurrency(value)}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: colors.border, strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="amount"
              stroke={colors.primary}
              strokeWidth={2.5}
              fill="url(#monthlySpendFill)"
              dot={{ r: 3, fill: colors.primary, strokeWidth: 0 }}
              activeDot={{
                r: 5,
                fill: colors.primary,
                strokeWidth: 2,
                stroke: colors.surface,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}