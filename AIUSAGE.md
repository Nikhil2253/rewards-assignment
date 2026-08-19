# AI Usage

## Where I used it

I used [Claude / ChatGPT / Copilot / Cursor — name what you actually used] throughout, mainly for:

- Reviewing the transactions query logic on the backend, which is where it caught that sorting had no secondary tiebreaker key — ties on `timestamp` or `amount` could come back in inconsistent order across paginated requests. Fixed by adding `Transaction.id` as a secondary sort key.
- Restructuring the sort UI on the frontend. The first pass had sort buttons living inside individual table cells, which technically worked but wasn't how sortable tables are supposed to behave. Moved the trigger into the column headers (`<th>`) instead, and added `aria-sort` for accessibility.
- Reworking the transaction detail modal from a set of ad-hoc label/value pairs into a data-driven row list with icons, for visual consistency.
- Formatting the coin balance in the header with Indian-style number grouping (`en-IN` locale) instead of the default Western thousands grouping.
- [Add anything else it genuinely helped with — seed script scaffolding, chart setup, drafting these docs, etc.]

## Things I threw away or had to fix

**1. [Concrete example — required]**
What it generated: [describe]
Why I didn't keep it as-is: [what was actually wrong — a bad assumption about the schema, something that broke a requirement in the brief, an overcomplicated approach, etc.]

**2. [Concrete example — required]**
What it generated: [describe]
Why I didn't keep it as-is: [describe]

## A note on the above

I reviewed and, in places, restructured everything AI-assisted before it went into the final submission — the sort UI rework above is a direct example of that. I can walk through and modify any part of this codebase live.