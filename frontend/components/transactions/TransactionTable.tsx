"use client";

import Table, { TableColumn } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

type Transaction = {
  id: string;
  timestamp: string;
  merchant: string;
  category: string;
  amount: number;
  currency: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  payment_method: string;
};

type TransactionTableProps = {
  transactions: Transaction[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (column: string) => void;
  loading?: boolean;
  error?: string;
  onRowClick?: (transaction: Transaction) => void;
};

export default function TransactionTable({
  transactions,
  sortBy,
  sortOrder,
  onSortChange,
  loading,
  error,
  onRowClick,
}: TransactionTableProps) {
  const columns: TableColumn<Transaction>[] = [
    {
      key: "timestamp",
      header: "Date",
      render: (transaction) => (
        <button
          type="button"
          onClick={() => onSortChange("timestamp")}
          className="font-medium"
        >
          {new Date(transaction.timestamp).toLocaleDateString()}
          {sortBy === "timestamp" && (
            <span className="ml-1">
              {sortOrder === "asc" ? "↑" : "↓"}
            </span>
          )}
        </button>
      ),
    },
    {
      key: "merchant",
      header: "Merchant",
      render: (transaction) => (
        <button
          type="button"
          onClick={() => onSortChange("merchant")}
          className="font-medium"
        >
          {transaction.merchant}
          {sortBy === "merchant" && (
            <span className="ml-1">
              {sortOrder === "asc" ? "↑" : "↓"}
            </span>
          )}
        </button>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (transaction) => transaction.category,
    },
    {
      key: "amount",
      header: "Amount",
      render: (transaction) => (
        <button
          type="button"
          onClick={() => onSortChange("amount")}
          className="font-medium"
        >
          {transaction.currency} {transaction.amount.toFixed(2)}
          {sortBy === "amount" && (
            <span className="ml-1">
              {sortOrder === "asc" ? "↑" : "↓"}
            </span>
          )}
        </button>
      ),
    },
    {
      key: "payment_method",
      header: "Payment Method",
      render: (transaction) => transaction.payment_method,
    },
    {
      key: "status",
      header: "Status",
      render: (transaction) => (
        <Badge
  variant={
    transaction.status === "SUCCESS"
      ? "success"
      : transaction.status === "PENDING"
        ? "warning"
        : "danger"
  }
>
  {transaction.status}
</Badge>
      ),
    },
  ];

  return (
    <div className="mt-6">
      <Table
  columns={columns}
  data={transactions}
  getRowKey={(transaction) => transaction.id}
  loading={loading}
  error={error}
  onRowClick={onRowClick}
/>
    </div>
  );
}