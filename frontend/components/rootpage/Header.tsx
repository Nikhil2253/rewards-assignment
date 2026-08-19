"use client";

import { usePathname } from "next/navigation";
import { Coins } from "lucide-react";
import { colors, radius, spacing, shadow, typography } from "@/lib/tokens";
import { useEffect, useState } from "react";

const pageContent: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Transactions",
    subtitle: "Track every payment in and out",
  },
  "/analytics": {
    title: "Analytics",
    subtitle: "See how your spending trends over time",
  },
  "/rewards": {
    title: "Rewards",
    subtitle: "Track what you've earned and redeemed",
  },
};

export default function Header() {
  const [coins, setCoins] = useState<number | null>(null);
  const pathname = usePathname();
  const { title, subtitle } = pageContent[pathname] ?? pageContent["/"];
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchCoinsCount = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch("http://localhost:8000/rewards/balance");

        if (!response.ok) {
          throw new Error("Failed to fetch coin balance");
        }

        const data = await response.json();
        setCoins(data.coin_balance);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinsCount();
  }, []);

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6"
      style={{
        borderColor: colors.border,
        paddingLeft: spacing.lg,
        paddingRight: spacing.lg,
      }}
    >
      <div>
        <p
          style={{
            color: colors.textPrimary,
            fontFamily: typography.fontDisplay,
            fontSize: typography.size.md,
            fontWeight: typography.weight.semibold,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </p>

        <p
          style={{
            color: colors.textMuted,
            fontFamily: typography.fontBody,
            fontSize: typography.size.xs,
            fontWeight: typography.weight.medium,
            marginTop: "2px",
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Coin balance */}
      <div
        className="group flex items-center gap-3 py-1.5 pl-1.5 pr-4 transition-all duration-200"
        style={{
          borderRadius: radius.full,
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.surfaceHover,
          boxShadow: shadow.sm,
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.borderColor = "rgba(200,135,25,0.35)";
          event.currentTarget.style.boxShadow = shadow.md;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.borderColor = colors.border;
          event.currentTarget.style.boxShadow = shadow.sm;
        }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(200,135,25,0.22), rgba(200,135,25,0.10))",
            border: "1px solid rgba(200,135,25,0.28)",
          }}
        >
          <Coins size={16} strokeWidth={2.25} color={colors.accent} />
        </div>

        <div className="leading-tight">
          <p
            style={{
              color: colors.textMuted,
              fontFamily: typography.fontBody,
              fontSize: typography.size.xs,
            }}
          >
            Coin Balance
          </p>

          <p
            style={{
              color: error ? colors.danger : colors.textPrimary,
              fontFamily: typography.fontBody,
              fontSize: typography.size.sm,
              fontWeight: typography.weight.semibold,
              marginTop: "1px",
            }}
          >
            {loading ? "…" : error ? "—" : coins?.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </header>
  );
}