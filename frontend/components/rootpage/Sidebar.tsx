"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightLeft, PieChart, Gem, Flame } from "lucide-react";
import { colors, radius, typography } from "@/lib/tokens";

const navigation = [
  {
    label: "Transactions",
    href: "/",
    icon: ArrowRightLeft,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: PieChart,
  },
  {
    label: "Rewards",
    href: "/rewards",
    icon: Gem,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex h-screen w-60 shrink-0 flex-col"
      style={{
        backgroundColor: colors.sidebar,
        borderRight: `1px solid ${colors.sidebarBorder}`,
      }}
    >
      <div
        className="flex h-16 shrink-0 items-center px-5"
        style={{
          borderBottom: `1px solid ${colors.sidebarBorder}`,
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Ember home"
        >
          <div
            className="relative flex h-9 w-9 shrink-0 items-center justify-center bg-transparent"
            style={{
              border:`1px solid ${colors.sidebarGradientStart}`,
              borderRadius: radius.full,
              color: colors.sidebarGradientEnd,
              boxShadow: "0 6px 16px rgba(180,35,47,0.01)",
            }}
          >
            <Flame
              size={18}
              strokeWidth={2.25}
              color={colors.sidebarGradientStart}
              fill={colors.sidebarGradientStart}
              fillOpacity={0.18}
            />
          </div>

          <div className="leading-tight">
            <p
              style={{
                color: colors.sidebarText,
                fontFamily: typography.fontDisplay,
                fontSize: typography.size.md,
                fontWeight: typography.weight.semibold,
                letterSpacing: "-0.02em",
              }}
            >
              Rewards
            </p>

            <p
              style={{
                color: colors.sidebarTextMuted,
                fontFamily: typography.fontBody,
                fontSize: typography.size.xs,
                marginTop: "2px",
              }}
            >
              Payments & rewards
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 py-6 pr-4" aria-label="Main navigation">
        <div className="space-y-3">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group relative flex items-center gap-5 py-2 pl-5 pr-4 transition-all duration-200"
                style={{
                  borderTopRightRadius: radius.full,
                  borderBottomRightRadius: radius.full,

                  background: active
                    ? `linear-gradient(90deg, ${colors.sidebarGradientStart}, ${colors.sidebarGradientEnd})`
                    : "transparent",

                  color: active ? colors.surface : colors.sidebarTextMuted,

                  fontFamily: typography.fontBody,
                  fontSize: typography.size.base,

                  fontWeight: active
                    ? typography.weight.semibold
                    : typography.weight.medium,

                  boxShadow: active
                    ? "0 6px 16px rgba(180,35,47,0.24)"
                    : "none",
                }}
                onMouseEnter={(event) => {
                  if (!active) {
                    event.currentTarget.style.background = colors.sidebarHover;
                    event.currentTarget.style.color = colors.sidebarText;
                  }
                }}
                onMouseLeave={(event) => {
                  if (!active) {
                    event.currentTarget.style.background = "transparent";
                    event.currentTarget.style.color = colors.sidebarTextMuted;
                  }
                }}
              >
                {/* Icon */}
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center"
                  style={{
                    borderRadius: radius.sm,
                    backgroundColor: active
                      ? "rgba(255,255,255,0.16)"
                      : "transparent",
                    color: active ? colors.surface : colors.sidebarTextMuted,
                    transition: "background-color 200ms ease, color 200ms ease",
                  }}
                >
                  <Icon size={17} strokeWidth={2} />
                </span>

                {/* Label */}
                <span className="flex-1">{item.label}</span>

                {/* Active dot */}
                {active && (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: colors.surface,
                      opacity: 0.85,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Rewards card */}
      <div
        className="mx-3 mb-4 p-3"
        style={{
          borderRadius: radius.lg,
          background:
            "linear-gradient(135deg, rgba(200,135,25,0.14), rgba(200,135,25,0.05))",
          border: "1px solid rgba(200,135,25,0.22)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{
              backgroundColor: colors.accentMuted,
            }}
          >
            <Gem size={15} strokeWidth={2} color={colors.accent} />
          </div>

          <div className="min-w-0 leading-tight">
            <p
              style={{
                color: colors.sidebarTextMuted,
                fontFamily: typography.fontBody,
                fontSize: typography.size.xs,
              }}
            >
              Rewards
            </p>

            <p
              className="truncate"
              style={{
                color: colors.sidebarText,
                fontFamily: typography.fontBody,
                fontSize: typography.size.sm,
                fontWeight: typography.weight.semibold,
                marginTop: "2px",
              }}
            >
              Earn on every payment
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}