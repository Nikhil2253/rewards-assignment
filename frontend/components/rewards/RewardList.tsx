"use client";

import { Gift } from "lucide-react";
import RewardCard from "@/components/rewards/RewardCard";
import { colors, radius, typography } from "@/lib/tokens";

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
      <div
        className="flex flex-col items-center gap-3 p-10 text-center"
        style={{
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.accentMuted }}
        >
          <Gift size={18} strokeWidth={2} color={colors.accent} />
        </div>

        <p
          style={{
            color: colors.textPrimary,
            fontFamily: typography.fontBody,
            fontSize: typography.size.sm,
            fontWeight: typography.weight.semibold,
          }}
        >
          No rewards available.
        </p>

        <p
          style={{
            color: colors.textMuted,
            fontFamily: typography.fontBody,
            fontSize: typography.size.xs,
          }}
        >
          Check back soon — new rewards are added regularly.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            name={reward.name}
            description={reward.description}
            coinCost={reward.coin_cost}
            balance={balance}
            onRedeem={() => onRedeem(reward)}
            disabled={balance < reward.coin_cost}
          />
        ))}
      </div>
    </div>
  );
}