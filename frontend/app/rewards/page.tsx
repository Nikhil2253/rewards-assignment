"use client";

import { useEffect, useState } from "react";
import RewardsList from "@/components/rewards/RewardList";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

type Reward = {
  id: number;
  name: string;
  description: string | null;
  coin_cost: number;
};

export default function RewardsPage() {
  const [balance, setBalance] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
const [redeeming, setRedeeming] = useState(false);
const [redeemError, setRedeemError] = useState("");
const [redeemSuccess, setRedeemSuccess] = useState("");

const handleRedeem = async () => {
  if (!selectedReward) {
    return;
  }

  try {
    setRedeeming(true);
    setRedeemError("");
    setRedeemSuccess("");

    const response = await fetch(
      "http://127.0.0.1:8000/rewards/redeem",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reward_id: selectedReward.id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to redeem reward");
    }

    setBalance(data.new_balance);

    setRedeemSuccess(
      `${data.reward_name} redeemed successfully.`
    );

    setSelectedReward(null);
  } catch (error) {
    setRedeemError(
      error instanceof Error
        ? error.message
        : "Failed to redeem reward."
    );
  } finally {
    setRedeeming(false);
  }
};

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        setError("");

        const [balanceResponse, rewardsResponse] = await Promise.all([
          fetch("http://127.0.0.1:8000/rewards/balance"),
          fetch("http://127.0.0.1:8000/rewards"),
        ]);

        if (!balanceResponse.ok || !rewardsResponse.ok) {
          throw new Error("Failed to load rewards");
        }

        const balanceData = await balanceResponse.json();
        const rewardsData = await rewardsResponse.json();

        setBalance(balanceData.coin_balance);
        setRewards(rewardsData);
      } catch (error) {
        console.error(error);
        setError("Unable to load rewards. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 p-6">
        <p className="text-sm text-gray-500">
          Loading rewards...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-6">
        <p className="text-sm text-red-600">
          {error}
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Rewards
        </h2>

        <p className="mt-2 text-gray-500">
          Redeem your coins for rewards.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-500">
          Available coins
        </p>

        <p className="mt-1 text-3xl font-semibold text-gray-900">
          {balance.toLocaleString("en-IN")}
        </p>
      </div>

      <RewardsList
        rewards={rewards}
        balance={balance}
        onRedeem={(reward) => {
  setRedeemError("");
  setRedeemSuccess("");
  setSelectedReward(reward);
}}
      />

      <Modal
  open={selectedReward !== null}
  onClose={() => {
    if (!redeeming) {
      setSelectedReward(null);
    }
  }}
  title="Confirm redemption"
>
  {selectedReward && (
    <div>
      <p className="text-sm text-gray-600">
        Are you sure you want to redeem:
      </p>

      <p className="mt-2 font-semibold text-gray-900">
        {selectedReward.name}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        This will cost{" "}
        {selectedReward.coin_cost.toLocaleString("en-IN")} coins.
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="secondary"
          type="button"
          disabled={redeeming}
          onClick={() => setSelectedReward(null)}
        >
          Cancel
        </Button>

        <Button
          type="button"
          disabled={redeeming}
          onClick={handleRedeem}
        >
          {redeeming ? "Redeeming..." : "Confirm"}
        </Button>
      </div>
    </div>
  )}
</Modal>
    </main>
  );
}