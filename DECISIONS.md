# Decisions

- **State management** — plain `useState` in `page.tsx`, no Zustand/Redux. It's one dashboard route, nothing deeply nested, so a global store felt like overhead with no real problem to solve.
- **Pagination over virtualization** — server-side pagination (10 rows/page). Keeps the DOM light and pushes filter/sort/search to the DB instead of an in-memory array.
- **Sorting** — whitelisted to `timestamp`/`amount` on the backend, sort trigger lives in the column headers. Added `Transaction.id` as a tiebreaker after finding ties could return inconsistent order across pages.
- **Filters** — all applied server-side before pagination, so the API is the single source of truth for "what matches the view."
- **Coin balance not syncing after redeem** — header only fetches once on mount. Known gap, didn't get to wiring a shared context for it.
- **Modal** — hand-built, focus trap + Escape to close.
- **Schema** — [fill in: tables, indexes, how coin balance/redemptions are modeled]