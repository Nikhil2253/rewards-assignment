"use client";

import RewardCard from "@/components/rewards/RewardCard";

type Reward = {
  id: number;
  name: string;
  description: string | null;
  coin_cost: number;
};

type RewardsListProps = {
  rewards: Reward[];
  balance: number;
  onRedeem: (reward: Reward) => void;
};

export default function RewardsList({
  rewards,
  balance,
  onRedeem,
}: RewardsListProps) {
  if (rewards.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          No rewards available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {rewards.map((reward) => (
        <RewardCard
          key={reward.id}
          name={reward.name}
          description={reward.description}
          coinCost={reward.coin_cost}
          onRedeem={() => onRedeem(reward)}
          disabled={balance < reward.coin_cost}
        />
      ))}
    </div>
  );
}