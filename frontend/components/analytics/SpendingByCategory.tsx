"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type CategorySpending = {
  category: string;
  amount: number;
};

type SpendingByCategoryProps = {
  data: CategorySpending[];
  onCategoryClick: (category: string) => void;
};

const COLORS = [
  "#0E6E55",
  "#C88719",
  "#1E8E5A",
  "#8A6D00",
  "#C1352B",
  "#5B6270",
];

export default function SpendingByCategory({
  data,
  onCategoryClick,
}: SpendingByCategoryProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Spending by Category
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Click a category to filter transactions.
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={55}
              paddingAngle={2}
              onClick={(entry) => {
                onCategoryClick(entry.category);
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.category}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <button
            key={item.category}
            type="button"
            onClick={() => onCategoryClick(item.category)}
            className="flex items-center gap-2 rounded-lg p-2 text-left text-sm hover:bg-gray-50"
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: COLORS[index % COLORS.length],
              }}
            />

            <span className="text-gray-700">
              {item.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}