"use client";

import MonthlySpendingTrend from "@/components/analytics/MonthlySpending";
import SpendingByCategory from "@/components/analytics/SpendingByCategory";
import { useEffect, useState } from "react";
import { BarChart3, AlertTriangle } from "lucide-react";
import { colors, radius, typography } from "@/lib/tokens";

type CategorySpending = {
  category: string;
  amount: number;
};

type MonthlySpending = {
  month: string;
  amount: number;
};

export default function AnalyticsPage() {
  const [categorySpending, setCategorySpending] = useState<
    CategorySpending[]
  >([]);

  const [monthlySpending, setMonthlySpending] = useState<
    MonthlySpending[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoryResponse, monthlyResponse] =
          await Promise.all([
            fetch(
              "http://127.0.0.1:8000/analytics/spending-by-category"
            ),
            fetch(
              "http://127.0.0.1:8000/analytics/monthly-spending"
            ),
          ]);

        if (!categoryResponse.ok || !monthlyResponse.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const categoryData = await categoryResponse.json();
        const monthlyData = await monthlyResponse.json();

        setCategorySpending(categoryData);
        setMonthlySpending(monthlyData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-6">
      {/* Page header — matches the icon-badge pattern used across the app */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center"
          style={{
            borderRadius: radius.md,
            backgroundColor: colors.primaryMuted,
          }}
        >
          <BarChart3 size={20} strokeWidth={2.25} color={colors.primary} />
        </div>

        <div>
          <h2
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fontDisplay,
              fontSize: typography.size.lg,
              fontWeight: typography.weight.bold,
              letterSpacing: "-0.01em",
            }}
          >
            Spending Analytics
          </h2>

          <p
            style={{
              color: colors.textMuted,
              fontFamily: typography.fontBody,
              fontSize: typography.size.sm,
              marginTop: "2px",
            }}
          >
            Understand your spending patterns over time.
          </p>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div
            className="animate-pulse xl:col-span-3"
            style={{
              height: "420px",
              borderRadius: radius.lg,
              backgroundColor: colors.surfaceHover,
              border: `1px solid ${colors.border}`,
            }}
          />
          <div
            className="animate-pulse xl:col-span-2"
            style={{
              height: "420px",
              borderRadius: radius.lg,
              backgroundColor: colors.surfaceHover,
              border: `1px solid ${colors.border}`,
            }}
          />
        </div>
      )}

      {!loading && error && (
        <div
          className="flex items-start gap-3 p-4"
          style={{
            borderRadius: radius.lg,
            backgroundColor: "rgba(180,35,47,0.06)",
            border: "1px solid rgba(180,35,47,0.20)",
          }}
        >
          <AlertTriangle
            size={18}
            strokeWidth={2.25}
            color={colors.sidebarGradientStart}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p
              style={{
                color: colors.textPrimary,
                fontFamily: typography.fontBody,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
              }}
            >
              Couldn&apos;t load analytics
            </p>

            <p
              style={{
                color: colors.textMuted,
                fontFamily: typography.fontBody,
                fontSize: typography.size.xs,
                marginTop: "2px",
              }}
            >
              {error}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <MonthlySpendingTrend data={monthlySpending} />
          </div>

          <div className="xl:col-span-2">
            <SpendingByCategory
              data={categorySpending}
              onCategoryClick={() => {}}
            />
          </div>
        </div>
      )}
    </main>
  );
}