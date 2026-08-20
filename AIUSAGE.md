## AI Usage

I used both ChatGPT and Claude at different stages of the development process, across the frontend and backend.

### ChatGPT

Used primarily during the initial project setup and scaffolding, including:

- Frontend project structure and component organization
- Backend/FastAPI setup and API structure
- PostgreSQL/Supabase database setup
- Initial database models and backend structure
- Initial seed implementation for the provided `transactions.json`

### Claude

Used during later implementation and review, including:

- Frontend component structure and implementation
- Backend transaction queries and logic
- Table sorting and transaction detail interactions
- Debugging and refinement
- Indian-style number formatting using `en-IN`

### AI Output I Changed or Rejected

I did not use AI-generated output without reviewing it. I made changes where the generated implementation did not fit the requirements or the design I wanted.

1. **Frontend UI and styling**

   The initial AI-generated frontend provided a functional component structure, but the UI did not have the visual theme and level of polish I wanted. I redesigned and adjusted the CSS myself, including the overall theme, borders, spacing, layout, colors, and visual consistency across the dashboard.

2. **Table sorting**

   The initial implementation handled sorting from within individual table cells. I changed this to use sorting controls in the table headers, including sort direction indicators and `aria-sort`, which better matched the table interaction I wanted.

3. **Backend sorting**

   The initial backend sorting used only the selected field, such as timestamp or amount. I added `Transaction.id` as a secondary sort key so that ordering remains stable when multiple transactions have the same timestamp or amount.

4. **Transaction seed logic**

   The initial seed implementation needed changes to work correctly with the provided `transactions.json`. I modified the seed/data handling, including timestamp normalization and the database insertion logic, based on the actual structure of the supplied dataset.

5. **Generated code complexity**

   Some generated frontend and backend code was more complicated than necessary. I removed unnecessary abstractions and simplified parts of the implementation to keep the code focused on the assignment requirements.

AI was used as a development aid rather than as a replacement for implementation decisions. I reviewed the generated code, made the required changes, and verified the final behavior against the assignment requirements.