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
      sortable: true,
      render: (transaction) =>
        new Date(transaction.timestamp).toLocaleDateString(),
    },
    {
      key: "merchant",
      header: "Merchant",
      render: (transaction) => transaction.merchant,
    },
    {
      key: "category",
      header: "Category",
      render: (transaction) => transaction.category,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (transaction) =>
        `${transaction.currency} ${transaction.amount.toFixed(2)}`,
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
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
      />
    </div>
  );
}