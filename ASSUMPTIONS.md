# Assumptions

- **Reward catalogue** — went with [your 4-6 rewards, e.g. cashback + vouchers]. Kept it flat, no tiers/expiry, to keep redeem validation simple.
- **Coin cap per transaction** — set at [X coins], mainly so one big transaction can't blow up the balance.
- **Coins only on SUCCESS** — pending/failed transactions don't earn coins, and there's no retroactive earn if a pending one later succeeds.
- **Modal over drawer** — easier to hand-build a proper focus trap for, and holds up better at 360px.
- **One-way chart filtering** — chart click filters the table, not the other way around. That's what the brief asks for as the minimum.