# Decisions

- **State management** — plain `useState` in `page.tsx`, no Zustand/Redux. It's one dashboard route, nothing deeply nested, so a global store felt like overhead with no real problem to solve.

- **Pagination over virtualization** — server-side pagination (10 rows/page). Keeps the DOM light and pushes filter/sort/search to the database instead of loading and managing the full dataset in the browser.

- **Sorting** — whitelisted to `timestamp`/`amount` on the backend, with sort controls in the column headers. Added `Transaction.id` as a tiebreaker after identifying that tied values could otherwise produce inconsistent ordering across pages.

- **Filters** — category, date range, amount range, payment status, and merchant search are applied server-side before pagination, keeping the API as the single source of truth for the transaction view.

- **Coin balance** — stored on the `users` table rather than recalculated on every request. Successful transactions contribute coins during seeding, and redemption deducts the reward's coin cost from the stored balance.

- **Rewards and redemptions** — rewards are stored separately from `redemptions`. A redemption references both the user and reward and stores `coins_spent`, preserving a record of what was redeemed even if a reward is later changed or deactivated.

- **Schema** — PostgreSQL uses separate `transactions`, `users`, `rewards`, and `redemptions` tables rather than storing the supplied JSON as a single column. `transactions.id` is the primary key, while `merchant`, `category`, and `status` are indexed because they are commonly used for searching and filtering. Foreign keys connect `redemptions` to `users` and `rewards`.

- **Money storage** — transaction amounts use PostgreSQL `NUMERIC(12,2)` rather than floating-point values to avoid precision issues when working with monetary amounts.

- **Timestamp handling** — timestamps are stored as timezone-aware PostgreSQL timestamps. The seed process normalizes the different timestamp formats present in the supplied `transactions.json` before insertion.

- **Modal** — hand-built, with focus trapping and Escape-to-close behavior, rather than using a component library for the transaction detail interaction.