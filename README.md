# Budget Tracker Frontend

React dashboard interface for monitoring company spending, managing department budget allocations, and handling invoice approvals.

## Demo

[View Live Demo](https://invoice-tracker-frontend-teal.vercel.app/)

## Key Features

### 1. Invoice Approval Workflow
* Review, accept, or reject pending invoices in the **Invoices** section.
* Status updates appear instantly on the **Manager Dashboard** without a page refresh.

### 2. Dynamic Budget Allocation
* Increase budget limits for specific departments (e.g., Marketing) to clear "Over budget" warnings.
* Budget updates apply across both the Manager Dashboard and the Employee view.

### 3. Invoice Submission
* Submit new invoices by selecting a department, adding a description, and entering the expense amount.
* Submitted invoices appear instantly in the manager's review list on the dashboard.

### 4. Visual Budget Indicators
* Progress bars change colors based on department spending thresholds:
    * **Green:** Safe spending range (<80% of budget spent)
    * **Orange:** Warning / approaching limit (80%–100% of budget spent)
    * **Red:** Over budget limit (>100% of budget spent)

### 5. Department Shortcuts 
* Click any department card on the **Manager Dashboard** to jump straight to its invoices.

## Tech Stack
* React
* Vite
* JavaScript

## Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```