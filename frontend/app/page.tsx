"use client";

import SpendingByCategory from "@/components/analytics/SpendingByCategory";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionPagination from "@/components/transactions/TransactionPagination";
import TransactionTable from "@/components/transactions/TransactionTable";
import Modal from "@/components/ui/Modal";
import { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
const [category, setCategory] = useState("");
const [status, setStatus] = useState("");
const [amountMin, setAmountMin] = useState("");
const [amountMax, setAmountMax] = useState("");
const [dateFrom, setDateFrom] = useState("");
const [dateTo, setDateTo] = useState("");
const [sortBy, setSortBy] = useState("timestamp");
const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [debouncedSearch, setDebouncedSearch] = useState("");
const [selectedTransaction, setSelectedTransaction] =
  useState<Transaction | null>(null);
  const [categorySpending, setCategorySpending] = useState<
  { category: string; amount: number }[]
>([]);
const [categories, setCategories] = useState<string[]>([]);

const handleSortChange = (column: string) => {
  if (sortBy === column) {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  } else {
    setSortBy(column);
    setSortOrder("asc");
  }
};

const handleClearFilters = () => {
  setSearch("");
  setCategory("");
  setStatus("");
  setAmountMin("");
  setAmountMax("");
  setDateFrom("");
  setDateTo("");
  setPage(1);
};

useEffect(() => {
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (debouncedSearch) {
  params.set("search", debouncedSearch);
}

if (category) {
  params.set("category", category);
}

if (status) {
  params.set("status", status);
}

if (amountMin) {
  params.set("amount_min", amountMin);
}

if (amountMax) {
  params.set("amount_max", amountMax);
}

if (dateFrom) {
  params.set("date_from", dateFrom);
}

if (dateTo) {
  params.set("date_to", dateTo);

}

params.set("sort_by", sortBy);
params.set("sort_order", sortOrder);
params.set("limit", "10");
params.set("page", page.toString());

      const response = await fetch(
  `http://127.0.0.1:8000/transactions?${params.toString()}`
);

if (!response.ok) {
  throw new Error("Failed to fetch transactions");
}

const data = await response.json();

setTransactions(data.items);
setTotalPages(data.total_pages);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchTransactions();
}, [page, category, sortBy, sortOrder, debouncedSearch, status, amountMin, amountMax, dateFrom, dateTo]);

useEffect(() => {
  setPage(1);
}, [
  debouncedSearch,
  category,
  status,
  amountMin,
  amountMax,
  dateFrom,
  dateTo,
  sortBy,
  sortOrder,
]);

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timer);
}, [search]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analytics/categories"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data: string[] = await response.json();

      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchCategories();
}, []);

  return (
    <main className="flex-1 p-6">
  <div className="mb-6">
    <h2 className="text-2xl font-semibold">Transactions</h2>

    <p className="mt-2 text-gray-500">
      View and filter your transactions.
    </p>
  </div>

 <TransactionFilters
  search={search}
  category={category}
  status={status}
  amountMin={amountMin}
  amountMax={amountMax}
  dateFrom={dateFrom}
  dateTo={dateTo}
  categoryOptions={categories.map((item) => ({
    label: item,
    value: item,
  }))}
  onSearchChange={setSearch}
  onCategoryChange={setCategory}
  onStatusChange={setStatus}
  onAmountMinChange={setAmountMin}
  onAmountMaxChange={setAmountMax}
  onDateFromChange={setDateFrom}
  onDateToChange={setDateTo}
  onClearFilters={handleClearFilters}
/>

<TransactionTable
  transactions={transactions}
  sortBy={sortBy}
  sortOrder={sortOrder}
  onSortChange={handleSortChange}
  loading={loading}
  error={error}
  onRowClick={setSelectedTransaction}
/>

<TransactionPagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>

<Modal
  open={selectedTransaction !== null}
  onClose={() => setSelectedTransaction(null)}
  title="Transaction Details"
>
  {selectedTransaction && (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium uppercase text-gray-500">
          Transaction ID
        </p>
        <p className="mt-1 font-medium">
          {selectedTransaction.id}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase text-gray-500">
          Merchant
        </p>
        <p className="mt-1">
          {selectedTransaction.merchant}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase text-gray-500">
          Category
        </p>
        <p className="mt-1">
          {selectedTransaction.category}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase text-gray-500">
          Amount
        </p>
        <p className="mt-1 font-semibold">
          ₹{selectedTransaction.amount.toFixed(2)}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase text-gray-500">
          Payment Method
        </p>
        <p className="mt-1">
          {selectedTransaction.payment_method}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase text-gray-500">
          Status
        </p>
        <p className="mt-1">
          {selectedTransaction.status}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase text-gray-500">
          Date
        </p>
        <p className="mt-1">
          {new Date(
            selectedTransaction.timestamp
          ).toLocaleString()}
        </p>
      </div>
    </div>
  )}
</Modal>
</main>
  );
}