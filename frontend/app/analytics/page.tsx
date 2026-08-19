"use client";

import SpendingByCategory from "@/components/analytics/SpendingByCategory";
import { useEffect, useState } from "react";

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

        const categoryData =
          await categoryResponse.json();

        const monthlyData =
          await monthlyResponse.json();

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
    <main className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Spending Analytics
        </h2>

        <p className="mt-2 text-gray-500">
          Understand your spending patterns over time.
        </p>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">
            Loading analytics...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          {/* Category breakdown */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                Spending by Category
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                See where your money is being spent.
              </p>
            </div>

            <SpendingByCategory
              data={categorySpending}
              onCategoryClick={() => {}}
            />
          </section>

          {/* Monthly trend */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                Monthly Spending Trend
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Track how your spending changes month by month.
              </p>
            </div>

            <div className="space-y-3">
              {monthlySpending.map((item) => (
                <div
                  key={item.month}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0"
                >
                  <span className="text-sm text-gray-600">
                    {item.month}
                  </span>

                  <span className="font-medium text-gray-900">
                    ₹{item.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}