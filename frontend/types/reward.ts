export interface Reward {
  id: number;
  name: string;
  description: string | null;
  coin_cost: number;
}

export interface BalanceResponse {
  coin_balance: number;
}

export interface RedeemResponse {
  success: boolean;
  new_balance: number;
  reward_name: string;
  coins_spent: number;
}