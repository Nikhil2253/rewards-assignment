"use client";

import {
  Coins,
  Gift,
  Ticket,
  Percent,
  Coffee,
  Smartphone,
  Headphones,
  ShoppingBag,
  Plane,
  Award,
  Lock,
  type LucideIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { colors, radius, shadow, typography } from "@/lib/tokens";

type RewardCardProps = {
  name: string;
  description: string | null;
  coinCost: number;
  balance: number;
  onRedeem: () => void;
  disabled?: boolean;
};

// Picks a representative icon from the reward's name/description so the
// grid reads at a glance instead of every card looking identical.
export function getRewardIcon(
  name: string,
  description: string | null
): LucideIcon {
  const text = `${name} ${description ?? ""}`.toLowerCase();

  if (/(coffee|cafe|latte|tea)/.test(text)) return Coffee;
  if (/(flight|travel|trip|hotel|miles)/.test(text)) return Plane;
  if (/(phone|mobile|recharge|data)/.test(text)) return Smartphone;
  if (/(headphone|audio|music|earbud)/.test(text)) return Headphones;
  if (/(voucher|coupon|discount|%|off)/.test(text)) return Percent;
  if (/(ticket|movie|event|show)/.test(text)) return Ticket;
  if (/(shop|store|merch|bag)/.test(text)) return ShoppingBag;
  if (/(badge|award|milestone|tier)/.test(text)) return Award;

  return Gift;
}

// The surface the ticket sits on — the tear-line "punch holes" are filled
// with this so they read as actual cut-outs rather than gray dots. Pass
// colors.background when the ticket sits on the page, or colors.surface
// when it sits inside a white modal.
type TicketTone = "gradient" | "muted";

type RewardTicketPreviewProps = {
  name: string;
  description: string | null;
  coinCost: number;
  icon?: LucideIcon;
  tone?: TicketTone;
  punchBg?: string;
  compact?: boolean;
};

// The reusable "ticket face" — a gradient stub with an icon and a
// dashed, notch-punched tear line into a body. Used by the grid card
// and by the redeem confirmation modal so both show the same object.
export function RewardTicketPreview({
  name,
  description,
  coinCost,
  icon,
  tone = "gradient",
  punchBg = colors.background,
  compact = false,
}: RewardTicketPreviewProps) {
  const Icon = icon ?? getRewardIcon(name, description);
  const muted = tone === "muted";

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadow.sm,
      }}
    >
      {/* Stub */}
      <div
        className={`relative flex items-center gap-3 px-5 ${
          compact ? "py-4" : "py-5"
        }`}
        style={{
          background: muted
            ? colors.surfaceHover
            : `linear-gradient(135deg, ${colors.sidebarGradientStart}, ${colors.sidebarGradientEnd})`,
        }}
      >
        {!muted && (
          <Icon
            size={88}
            strokeWidth={1.25}
            color="rgba(255,255,255,0.10)"
            className="pointer-events-none absolute -right-4 -top-4"
          />
        )}

        <div
          className="relative flex h-11 w-11 shrink-0 items-center justify-center"
          style={{
            borderRadius: radius.md,
            backgroundColor: muted ? colors.surface : "rgba(255,255,255,0.16)",
            border: muted
              ? `1px solid ${colors.border}`
              : "1px solid rgba(255,255,255,0.28)",
          }}
        >
          <Icon
            size={19}
            strokeWidth={2}
            color={muted ? colors.textMuted : colors.surface}
          />
        </div>

        <div className="relative min-w-0">
          <p
            className="truncate"
            style={{
              color: muted ? colors.textPrimary : colors.surface,
              fontFamily: typography.fontDisplay,
              fontSize: typography.size.base,
              fontWeight: typography.weight.semibold,
              letterSpacing: "-0.01em",
            }}
          >
            {name}
          </p>
          <p
            style={{
              color: muted ? colors.textMuted : "rgba(255,255,255,0.72)",
              fontFamily: typography.fontBody,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.medium,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginTop: "2px",
            }}
          >
            Reward
          </p>
        </div>
      </div>

      {/* Tear line, punched with two notches */}
      <div className="relative h-0">
        <div
          className="absolute -left-2.5 top-0 h-5 w-5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: punchBg }}
        />
        <div
          className="absolute -right-2.5 top-0 h-5 w-5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: punchBg }}
        />
        <div
          className="absolute left-5 right-5 top-0 -translate-y-1/2 border-t border-dashed"
          style={{ borderColor: colors.border }}
        />
      </div>

      {/* Body */}
      <div className={`px-5 ${compact ? "pb-4 pt-3" : "pb-5 pt-4"}`}>
        {description ? (
          <p
            style={{
              color: colors.textMuted,
              fontFamily: typography.fontBody,
              fontSize: typography.size.sm,
              lineHeight: 1.55,
            }}
          >
            {description}
          </p>
        ) : (
          <p
            style={{
              color: colors.textMuted,
              fontFamily: typography.fontBody,
              fontSize: typography.size.sm,
              fontStyle: "italic",
            }}
          >
            No additional details for this reward.
          </p>
        )}

        <div
          className="mt-4 flex items-center gap-1.5"
          style={{
            color: colors.textPrimary,
            fontFamily: typography.fontDisplay,
            fontSize: typography.size.md,
            fontWeight: typography.weight.bold,
            letterSpacing: "-0.01em",
          }}
        >
          <Coins size={16} strokeWidth={2.25} color={colors.primary} />
          {coinCost.toLocaleString("en-IN")}
        </div>
      </div>
    </div>
  );
}

export default function RewardCard({
  name,
  description,
  coinCost,
  balance,
  onRedeem,
  disabled = false,
}: RewardCardProps) {
  const Icon = getRewardIcon(name, description);
  const progress = Math.min(100, Math.round((balance / coinCost) * 100));
  const coinsShort = Math.max(0, coinCost - balance);

  return (
    <div
      className="group relative flex flex-col overflow-hidden transition-all duration-200"
      style={{
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadow.sm,
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.boxShadow = shadow.md;
        event.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.boxShadow = shadow.sm;
        event.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Stub */}
      <div
        className="relative flex items-center gap-3 px-5 py-5"
        style={{
          background: disabled
            ? colors.surfaceHover
            : `linear-gradient(135deg, ${colors.sidebarGradientStart}, ${colors.sidebarGradientEnd})`,
        }}
      >
        {!disabled && (
          <Icon
            size={96}
            strokeWidth={1.25}
            color="rgba(255,255,255,0.10)"
            className="pointer-events-none absolute -right-4 -top-4"
          />
        )}

        <div
          className="relative flex h-11 w-11 shrink-0 items-center justify-center"
          style={{
            borderRadius: radius.md,
            backgroundColor: disabled
              ? colors.surface
              : "rgba(255,255,255,0.16)",
            border: disabled
              ? `1px solid ${colors.border}`
              : "1px solid rgba(255,255,255,0.28)",
          }}
        >
          <Icon
            size={19}
            strokeWidth={2}
            color={disabled ? colors.textMuted : colors.surface}
          />
        </div>

        <div className="relative min-w-0">
          <p
            className="truncate"
            style={{
              color: disabled ? colors.textPrimary : colors.surface,
              fontFamily: typography.fontDisplay,
              fontSize: typography.size.base,
              fontWeight: typography.weight.semibold,
              letterSpacing: "-0.01em",
            }}
          >
            {name}
          </p>
          <p
            style={{
              color: disabled ? colors.textMuted : "rgba(255,255,255,0.72)",
              fontFamily: typography.fontBody,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.medium,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginTop: "2px",
            }}
          >
            Reward
          </p>
        </div>

        {disabled && (
          <span
            className="relative ml-auto flex items-center gap-1 px-2 py-1"
            style={{
              borderRadius: radius.full,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              color: colors.textMuted,
              fontFamily: typography.fontBody,
              fontSize: typography.size.xs,
              fontWeight: typography.weight.medium,
            }}
          >
            <Lock size={10} strokeWidth={2.25} />
            {coinsShort.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      {/* Tear line, punched with two notches */}
      <div className="relative h-0">
        <div
          className="absolute -left-2.5 top-0 h-5 w-5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: colors.background }}
        />
        <div
          className="absolute -right-2.5 top-0 h-5 w-5 -translate-y-1/2 rounded-full"
          style={{ backgroundColor: colors.background }}
        />
        <div
          className="absolute left-5 right-5 top-0 -translate-y-1/2 border-t border-dashed"
          style={{ borderColor: colors.border }}
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <div className="mb-5 flex-1">
          {description ? (
            <p
              style={{
                color: colors.textMuted,
                fontFamily: typography.fontBody,
                fontSize: typography.size.sm,
                lineHeight: 1.55,
              }}
            >
              {description}
            </p>
          ) : (
            <p
              style={{
                color: colors.textMuted,
                fontFamily: typography.fontBody,
                fontSize: typography.size.sm,
                fontStyle: "italic",
              }}
            >
              No additional details for this reward.
            </p>
          )}
        </div>

        {disabled && (
          <div className="mb-4">
            <div
              className="h-1.5 w-full overflow-hidden"
              style={{
                borderRadius: radius.full,
                backgroundColor: colors.surfaceHover,
              }}
            >
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  borderRadius: radius.full,
                  background: `linear-gradient(90deg, ${colors.sidebarGradientStart}, ${colors.sidebarGradientEnd})`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span
            className="flex items-center gap-1.5"
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fontDisplay,
              fontSize: typography.size.md,
              fontWeight: typography.weight.bold,
              letterSpacing: "-0.01em",
            }}
          >
            <Coins size={16} strokeWidth={2.25} color={colors.primary} />
            {coinCost.toLocaleString("en-IN")}
          </span>

          <Button type="button" onClick={onRedeem} disabled={disabled}>
            Redeem
          </Button>
        </div>
      </div>
    </div>
  );
}