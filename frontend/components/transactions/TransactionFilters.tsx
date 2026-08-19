"use client";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "../ui/Button";

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
  onClearFilters
}: TransactionFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Search merchant"
        placeholder="Search merchants..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <Select
        label="Category"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        options={categoryOptions}
      />

      <Select
        label="Payment status"
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        options={statusOptions}
      />

      <Input
        label="Minimum amount"
        type="number"
        placeholder="₹0"
        value={amountMin}
        onChange={(event) => onAmountMinChange(event.target.value)}
      />

      <Input
        label="Maximum amount"
        type="number"
        placeholder="₹0"
        value={amountMax}
        onChange={(event) => onAmountMaxChange(event.target.value)}
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

      <Button
  type="button"
  variant="secondary"
  onClick={onClearFilters}
>
  Clear Filters
</Button>
    </div>
  );
}