# Assumptions

- **Reward catalogue** — created five rewards consisting of vouchers and cashback. The catalogue is intentionally flat, with no tiers or expiry rules, to keep the redemption flow focused on the requirements.

- **Coin cap per transaction** — set the earning cap at 100 coins per successful transaction. The brief specifies that earning is capped per transaction but does not define the numerical cap, so 100 coins is a product assumption.

- **Coins only on SUCCESS** — only transactions with `SUCCESS` status earn coins. Pending and failed transactions earn no coins.

- **Historical transactions and initial balance** — the supplied transaction dataset is treated as historical activity for the dashboard. The initial demo user's coin balance is calculated from successful transactions using the earning rule.

- **Coin earning rule** — users earn 1 coin for every ₹100 spent on a successful transaction, using the transaction amount before applying the per-transaction cap.

- **Modal over drawer** — transaction details and the redeem confirmation are handled using a modal. This keeps the interaction compact and allows a hand-built responsive implementation.

- **One-way chart filtering** — clicking a chart segment filters the transaction table. The table does not currently reshape the charts, as one-way chart-to-table filtering is the minimum requirement in the brief.

- **Transaction ownership** — the supplied `transactions.json` does not contain a user identifier, so the imported transactions are not artificially linked to a user. A demo user is used for the rewards and redemption functionality.

- **Currency** — transaction amounts are treated as INR because the supplied dataset contains `INR` currency values. Reward amounts such as ₹100 or ₹500 are product choices for the reward catalogue, not requirements specified by the brief.