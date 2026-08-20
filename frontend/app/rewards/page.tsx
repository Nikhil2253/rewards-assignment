"use client";

import { useEffect, useState } from "react";
import { Coins, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import RewardsList from "@/components/rewards/RewardList";
import { RewardTicketPreview } from "@/components/rewards/RewardCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { colors, radius, shadow, typography } from "@/lib/tokens";
import api from "@/lib/api";

type Reward = {
  id: number;
  name: string;
  description: string | null;
  coin_cost: number;
};

// Draw-in checkmark shown on a successful redeem — circle strokes in,
// then the check strokes in right after.
function SuccessCheck() {
  return (
    <div className="flex items-center justify-center py-2">
      <style>{`
        @keyframes rewarder-check-circle {
          from { stroke-dashoffset: 176; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes rewarder-check-mark {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes rewarder-check-pop {
          0% { transform: scale(0.85); opacity: 0; }
          60% { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        style={{ animation: "rewarder-check-pop 260ms ease-out" }}
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke={colors.success}
          strokeWidth="3"
          strokeDasharray="176"
          strokeDashoffset="176"
          style={{
            animation: "rewarder-check-circle 420ms ease-out forwards",
          }}
        />
        <path
          d="M20 33 L28 41 L44 23"
          fill="none"
          stroke={colors.success}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="40"
          strokeDashoffset="40"
          style={{
            animation:
              "rewarder-check-mark 260ms ease-out 380ms forwards",
          }}
        />
      </svg>
    </div>
  );
}

export default function RewardsPage() {
  const [balance, setBalance] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState("");
  const [redeemedName, setRedeemedName] = useState("");
  const [view, setView] = useState<"confirm" | "success">("confirm");
  const [isClosing, setIsClosing] = useState(false);

  // Close with a brief shrink/fade instead of an instant unmount — used
  // by Cancel, the X button, and the backdrop click alike.
  const closeModal = () => {
    if (redeeming) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setSelectedReward(null);
      setIsClosing(false);
      setView("confirm");
      setRedeemError("");
    }, 170);
  };

  const handleRedeem = async () => {
    if (!selectedReward) {
      return;
    }

    try {
      setRedeeming(true);
      setRedeemError("");

      const response = await api.post("/rewards/redeem", {
        reward_id: selectedReward.id,
      });

      const data = response.data;

      setBalance(data.new_balance);
      setRedeemedName(data.reward_name ?? selectedReward.name);
      setView("success");
    } catch (error: any) {
      setRedeemError(
        error?.response?.data?.detail ||
          (error instanceof Error ? error.message : "Failed to redeem reward.")
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
          api.get("/rewards/balance"),
          api.get("/rewards"),
        ]);

        const balanceData = balanceResponse.data;
        const rewardsData = rewardsResponse.data;

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
        <p
          style={{
            color: colors.textMuted,
            fontFamily: typography.fontBody,
            fontSize: typography.size.sm,
          }}
        >
          Loading rewards...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-6">
        <div
          className="flex items-center gap-2 p-4"
          style={{
            borderRadius: radius.md,
            backgroundColor: colors.dangerMuted,
            border: "1px solid rgba(193,53,43,0.24)",
          }}
        >
          <AlertCircle size={16} strokeWidth={2.25} color={colors.danger} />
          <p
            style={{
              color: colors.danger,
              fontFamily: typography.fontBody,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.medium,
            }}
          >
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={15} strokeWidth={2.25} color={colors.accent} />
          <p
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fontBody,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.semibold,
            }}
          >
            Available rewards
          </p>
        </div>

        <div
          className="flex shrink-0 items-center gap-2 py-1.5 pl-2 pr-3.5"
          style={{
            borderRadius: radius.full,
            background: `linear-gradient(135deg, ${colors.sidebarGradientStart}, ${colors.sidebarGradientEnd})`,
            boxShadow: shadow.sm,
          }}
        >
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.18)",
            }}
          >
            <Coins size={13} strokeWidth={2.25} color={colors.surface} />
          </div>

          <span
            style={{
              color: colors.surface,
              fontFamily: typography.fontBody,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.semibold,
              whiteSpace: "nowrap",
            }}
          >
            {balance.toLocaleString("en-IN")} coins
          </span>
        </div>
      </div>

      <RewardsList
        rewards={rewards}
        balance={balance}
        onRedeem={(reward) => {
          setRedeemError("");
          setView("confirm");
          setSelectedReward(reward);
        }}
      />

      <Modal
        open={selectedReward !== null}
        onClose={closeModal}
        title={view === "success" ? undefined : "Confirm redemption"}
      >
        {selectedReward && (
          <div
            style={{
              animation: isClosing
                ? "rewarder-content-exit 170ms ease-in forwards"
                : "rewarder-content-enter 160ms ease-out",
            }}
          >
            <style>{`
              @keyframes rewarder-content-exit {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.96); }
              }
              @keyframes rewarder-content-enter {
                from { opacity: 0; transform: scale(0.98); }
                to { opacity: 1; transform: scale(1); }
              }
            `}</style>

            {view === "confirm" && (
              <div>
                <p
                  className="mb-4"
                  style={{
                    color: colors.textSecondary,
                    fontFamily: typography.fontBody,
                    fontSize: typography.size.sm,
                  }}
                >
                  You're about to redeem this reward:
                </p>

                <RewardTicketPreview
                  name={selectedReward.name}
                  description={selectedReward.description}
                  coinCost={selectedReward.coin_cost}
                  punchBg={colors.surface}
                  compact
                />

                <p
                  className="mt-4"
                  style={{
                    color: colors.textMuted,
                    fontFamily: typography.fontBody,
                    fontSize: typography.size.xs,
                  }}
                >
                  Your balance will drop to{" "}
                  <span
                    style={{
                      color: colors.textPrimary,
                      fontWeight: typography.weight.semibold,
                    }}
                  >
                    {Math.max(
                      0,
                      balance - selectedReward.coin_cost
                    ).toLocaleString("en-IN")}
                  </span>{" "}
                  coins after this redemption.
                </p>

                {redeemError && (
                  <div
                    className="mt-4 flex items-center gap-2 p-3"
                    style={{
                      borderRadius: radius.md,
                      backgroundColor: colors.dangerMuted,
                      border: "1px solid rgba(193,53,43,0.24)",
                    }}
                  >
                    <AlertCircle
                      size={15}
                      strokeWidth={2.25}
                      color={colors.danger}
                    />
                    <p
                      style={{
                        color: colors.danger,
                        fontFamily: typography.fontBody,
                        fontSize: typography.size.xs,
                        fontWeight: typography.weight.medium,
                      }}
                    >
                      {redeemError}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="secondary"
                    type="button"
                    disabled={redeeming}
                    onClick={closeModal}
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

            {view === "success" && (
              <div className="flex flex-col items-center text-center">
                <SuccessCheck />

                <p
                  className="mt-1"
                  style={{
                    color: colors.textPrimary,
                    fontFamily: typography.fontDisplay,
                    fontSize: typography.size.md,
                    fontWeight: typography.weight.semibold,
                  }}
                >
                  Redeemed
                </p>

                <p
                  className="mt-1"
                  style={{
                    color: colors.textMuted,
                    fontFamily: typography.fontBody,
                    fontSize: typography.size.sm,
                  }}
                >
                  {redeemedName} is on its way.
                </p>

                <div
                  className="mt-4 flex items-center gap-1.5"
                  style={{
                    color: colors.textMuted,
                    fontFamily: typography.fontBody,
                    fontSize: typography.size.xs,
                  }}
                >
                  New balance
                  <span
                    className="flex items-center gap-1"
                    style={{
                      color: colors.textPrimary,
                      fontWeight: typography.weight.semibold,
                    }}
                  >
                    <Coins size={12} strokeWidth={2.25} color={colors.primary} />
                    {balance.toLocaleString("en-IN")}
                  </span>
                </div>

                <Button
                  type="button"
                  className="mt-6 w-full"
                  onClick={closeModal}
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </main>
  );
}