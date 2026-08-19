export type TransactionStatus = "SUCCESS" | "FAILED" | "PENDING";

export interface Transaction {
  id: string;
  timestamp: string;
  merchant: string;
  category: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_method: string;
}

export interface TransactionListResponse {
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  sort_by?: "timestamp" | "amount";
  sort_order?: "asc" | "desc";
}