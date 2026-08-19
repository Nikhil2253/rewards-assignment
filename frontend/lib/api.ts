import type { TransactionFilters, TransactionListResponse } from "@/types/transaction";
import type { Reward, BalanceResponse, RedeemResponse } from "@/types/reward";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://locahost:8000/";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }

  return res.json();
}

export function getTransactions(filters: TransactionFilters): Promise<TransactionListResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  return request(`/transactions?${params.toString()}`);
}

export function getRewards(): Promise<Reward[]> {
  return request("/rewards");
}

export function getBalance(): Promise<BalanceResponse> {
  return request("/rewards/balance");
}

export function redeemReward(rewardId: number): Promise<RedeemResponse> {
  return request("/rewards/redeem", {
    method: "POST",
    body: JSON.stringify({ reward_id: rewardId }),
  });
}