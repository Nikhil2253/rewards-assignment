# Rewards

A consumer app for paying credit-card bills, earning reward coins on payments, and reviewing your own spending. Built as a take-home assignment for Digital Alpha Technologies.

## What it does

The app is built around three things: a transactions dashboard that stays fast at ~10,000 rows, a couple of spend-analytics views tied to that same table, and a rewards system where successful payments earn coins that can be redeemed against a small catalogue of perks.

Specifically:

- **Transactions dashboard.** A hand-built table (no UI library) backed by server-side pagination, filtering, and sorting. You can filter by category, date range, amount range, and payment status — all combinable — search merchants as you type, and sort by date or amount by clicking the column headers. Clicking a row opens a modal with the full transaction detail.
- **Spend analytics.** [Describe which chart(s) you shipped — category breakdown, monthly trend, or both.] Clicking into a chart segment filters the transactions table below it.
- **Rewards.** Users earn 1 coin per ₹100 spent on successful payments, capped at [X coins] per transaction. The balance is always visible in the header and updates after a redeem. Coins can be redeemed against [N] rewards through a select → confirm → done flow, with the backend rejecting redemptions that are unaffordable or reference a reward that doesn't exist.

## Stack

- **Frontend:** Next.js, React, TypeScript. A small internal design system lives in `@/lib/tokens` — color, spacing, and type scales that every component pulls from rather than hardcoding values. The `Table` component is fully hand-built per the assignment's constraint: sticky header, hover/focus states, loading skeletons, empty/error states, and sortable column headers with `aria-sort`. The transaction detail `Modal` is also hand-built, with a focus trap and Escape-to-close.
- **Backend:** Python, FastAPI. Routes, business logic, and data access are kept in separate layers (`app/routes`, `app/service`, `app/model`) rather than one file doing everything.
- **Database:** PostgreSQL. Schema and seed script live in [`seed/seed.py`].

## Local setup

Should take under five minutes end to end.

```bash
git clone https://github.com/Nikhil2253/rewards-assignment.git
cd rewards-assignment

# Backend
cd backend

python -m venv venv

venv/Scripts/activate

pip install -r requirements.txt
```

Create a `.env` file in `backend/` and add your Postgres connection string:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[dbname]
```

Then run command:

```bash
python seed/seed.py
```

Start the backend:

```bash
uvicorn app.main:app --reload
# http://127.0.0.1:8000
```

Frontend, in a second terminal:

```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

Frontend environment variable — create `.env.local` in `frontend/`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Live version

This build wasn't deployed within the 24-hour window, so instead of a live link, there's a short screen recording walking through the app.

## Where things stand

**Done:**
- Transactions table with server-side pagination, filtering, search, and sorting (date and amount), all combinable
- [Chart(s) shipped] with click-through filtering into the table
- Coin balance visible in the header.
- Redeem flow with backend-side validation on both insufficient balance and invalid reward
- PostgreSQL schema with a one-command seed
- Demo video in place of a live deployment

**Not done:**
- Two-way chart-to-table filtering — only chart-to-table (one-way) is implemented, per the brief's minimum requirement
- Optimistic balance update with rollback on failed redeem — the redeem flow waits for the server response before updating the displayed balance, rather than updating optimistically and rolling back on failure

**Known issues:**
- Chart-to-table filtering isn't implemented — clicking a category slice or trend point on 
  /analytics doesn't currently filter the transactions table on the main dashboard. The brief 
  calls this out as a minimum requirement; I ran out of time to wire it and prioritized getting 
  the core table (filter/search/sort at 10k rows) and the rewards redeem flow solid instead, 
  per the brief's own stated ordering of what to focus on first.

## Other docs in this repo

- `ASSUMPTIONS.md` — product calls made where the brief left things open
- `DECISIONS.md` — the technical choices that mattered, and why
- `AI-USAGE.md` — which AI tools were used, where, and what got thrown out