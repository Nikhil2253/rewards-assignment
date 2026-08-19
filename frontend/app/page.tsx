"use client";

import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionPagination from "@/components/transactions/TransactionPagination";
import TransactionTable from "@/components/transactions/TransactionTable";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Transaction } from "@/types/transaction";
import { useEffect, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { colors, radius, typography } from "@/lib/tokens";
import {
  Hash,
  Store,
  Tag,
  IndianRupee,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

const statusConfig = {
  SUCCESS: { icon: CheckCircle2, variant: "success" as const, color: "#16a34a" },
  PENDING: { icon: Clock, variant: "warning" as const, color: "#d97706" },
  FAILED: { icon: XCircle, variant: "danger" as const, color: "#dc2626" },
};

type DetailRowProps = {
  label: string;
  children: React.ReactNode;
};

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div>
      <p
        style={{
          color: colors.textMuted,
          fontFamily: typography.fontBody,
          fontSize: typography.size.xs,
          fontWeight: typography.weight.semibold,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </p>
      <div
        className="mt-1"
        style={{
          color: colors.textPrimary,
          fontFamily: typography.fontBody,
          fontSize: typography.size.base,
        }}
      >
        {children}
      </div>
    </div>
  );
}

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
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [
    page,
    category,
    sortBy,
    sortOrder,
    debouncedSearch,
    status,
    amountMin,
    amountMax,
    dateFrom,
    dateTo,
  ]);

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
    <main className="flex-1 overflow-y-auto p-6">
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
          <div className="space-y-5">
            <div
              className="flex items-center justify-between rounded-xl p-4"
              style={{ background: "rgba(0,0,0,0.03)" }}
            >
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <span
                  className="flex items-center gap-0.5"
                  style={{
                    fontWeight: typography.weight.bold,
                    fontFamily: typography.fontDisplay,
                    fontSize: "1.5rem",
                  }}
                >
                  <IndianRupee size={18} />
                  {selectedTransaction.amount.toFixed(2)}
                </span>
              </div>

              {(() => {
                const config =
                  statusConfig[selectedTransaction.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;
                return (
                  <Badge variant={config.variant}>
                    <span className="flex items-center gap-1.5">
                      <StatusIcon size={14} />
                      {selectedTransaction.status}
                    </span>
                  </Badge>
                );
              })()}
            </div>

            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(0,0,0,0.08)" }}
            >
              {[
                { icon: Hash, label: "Transaction ID", value: selectedTransaction.id, mono: true },
                { icon: Store, label: "Merchant", value: selectedTransaction.merchant },
                { icon: Tag, label: "Category", value: selectedTransaction.category },
                { icon: CreditCard, label: "Payment Method", value: selectedTransaction.payment_method },
                {
                  icon: Calendar,
                  label: "Date",
                  value: new Date(selectedTransaction.timestamp).toLocaleString(),
                },
              ].map((row, i, arr) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.label}
                    className="flex items-center justify-between px-4 py-3"
                    style={{
                      borderBottom:
                        i < arr.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                    }}
                  >
                    <div className="flex items-center gap-2.5 text-gray-500">
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: 28,
                          height: 28,
                          background: "rgba(0,0,0,0.04)",
                        }}
                      >
                        <Icon size={14} />
                      </div>
                      <span className="text-sm">{row.label}</span>
                    </div>

                    <span
                      className={`text-sm text-right ${row.mono ? "font-mono" : ""}`}
                      style={{
                        fontWeight: typography.weight.medium,
                        maxWidth: "60%",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}