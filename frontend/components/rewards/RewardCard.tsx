"use client";

import Button from "@/components/ui/Button";

type RewardCardProps = {
  name: string;
  description: string | null;
  coinCost: number;
  onRedeem: () => void;
  disabled?: boolean;
};

export default function RewardCard({
  name,
  description,
  coinCost,
  onRedeem,
  disabled = false,
}: RewardCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900">
          {name}
        </h3>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900">
          {coinCost.toLocaleString("en-IN")} coins
        </span>

        <Button
          type="button"
          onClick={onRedeem}
          disabled={disabled}
        >
          Redeem
        </Button>
      </div>
    </div>
  );
}