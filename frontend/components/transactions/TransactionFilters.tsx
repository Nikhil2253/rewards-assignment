"use client";

import { useMemo } from "react";
import { Search, SlidersHorizontal, X, IndianRupee } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { colors, radius, typography } from "@/lib/tokens";

type TransactionFiltersProps = {
  search: string;
  category: string;
  status: string;
  amountMin: string;
  amountMax: string;
  dateFrom: string;
  dateTo: string;

  categoryOptions: {
    label: string;
    value: string;
  }[];

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAmountMinChange: (value: string) => void;
  onAmountMaxChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClearFilters: () => void;
};

const statusOptions = [
  { label: "Successful", value: "SUCCESS" },
  { label: "Failed", value: "FAILED" },
  { label: "Pending", value: "PENDING" },
];

export default function TransactionFilters({
  search,
  category,
  status,
  amountMin,
  amountMax,
  dateFrom,
  dateTo,
  categoryOptions,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onAmountMinChange,
  onAmountMaxChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
}: TransactionFiltersProps) {
  const activeFilterCount = useMemo(() => {
    return [
      search,
      category,
      status,
      amountMin,
      amountMax,
      dateFrom,
      dateTo,
    ].filter((value) => value !== "").length;
  }, [search, category, status, amountMin, amountMax, dateFrom, dateTo]);

  return (
    <Card className="mb-6">
      {/* Header: title, active-filter count, clear action */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center"
            style={{
              borderRadius: radius.sm,
              backgroundColor: colors.primaryMuted,
            }}
          >
            <SlidersHorizontal
              size={15}
              strokeWidth={2.25}
              color={colors.primary}
            />
          </div>

          <div className="flex items-center gap-2">
            <h3
              style={{
                color: colors.textPrimary,
                fontFamily: typography.fontDisplay,
                fontSize: typography.size.base,
                fontWeight: typography.weight.semibold,
                letterSpacing: "-0.01em",
              }}
            >
              Filters
            </h3>

            {activeFilterCount > 0 && (
              <Badge variant="info">{activeFilterCount} active</Badge>
            )}
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onClearFilters}
          disabled={activeFilterCount === 0}
        >
          <X size={14} strokeWidth={2.5} />
          Clear filters
        </Button>
      </div>

      {/* Search bar — full width, the primary way people find a transaction */}
      <div className="mb-4">
        <Input
          placeholder="Search by merchant name..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          icon={<Search size={16} strokeWidth={2.25} />}
        />
      </div>

      {/* Secondary filters, grouped in a responsive row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Select
          label="Category"
          value={category}
          onChange={onCategoryChange}
          options={categoryOptions}
          placeholder="All categories"
        />

        <Select
          label="Payment status"
          value={status}
          onChange={onStatusChange}
          options={statusOptions}
          placeholder="All statuses"
        />

        <Input
          label="Minimum amount"
          type="number"
          placeholder="0"
          value={amountMin}
          onChange={(event) => onAmountMinChange(event.target.value)}
          icon={<IndianRupee size={15} strokeWidth={2.25} />}
        />

        <Input
          label="Maximum amount"
          type="number"
          placeholder="0"
          value={amountMax}
          onChange={(event) => onAmountMaxChange(event.target.value)}
          icon={<IndianRupee size={15} strokeWidth={2.25} />}
        />

        <Input
          label="From"
          type="date"
          value={dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
        />

        <Input
          label="To"
          type="date"
          value={dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
        />
      </div>
    </Card>
  );
}