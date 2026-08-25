import { Link } from 'react-router-dom';
import MetricsGrid from './components/MetricsGrid/MetricsGrid';
import DepartmentBudgets from './components/DepartmentBudgets/DepartmentBudgets';
import RecentInvoicesTable from './components/RecentInvoicesTable/RecentInvoicesTable';
import './DashboardSection.css';

const mockMetrics = {
    totalBudget: 42000,
    totalSpent: 31240,
    pendingInvoices: 7,
    overBudget: 1,
};

const mockDepartments = [
    { id: '1', name: 'Marketing', spent: 8400, budget: 7000 },
    { id: '2', name: 'Sales', spent: 10800, budget: 12000 },
    { id: '3', name: 'Operations', spent: 7500, budget: 14000 },
    { id: '4', name: 'IT', spent: 4540, budget: 9000 },
];

const mockInvoices = [
    { id: 1, description: 'Google Ads — Oct', departmentName: 'Marketing', amount: 3200, status: 'Pending' },
    { id: 2, description: 'Adobe Creative Cloud', departmentName: 'IT', amount: 299, status: 'Approved' },
];

export default function DashboardSection() {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Manager Dashboard</h1>
                <p>Overview of current company spending and active budget limits.</p>
            </header>

            <MetricsGrid metrics={mockMetrics} />

            <section className="dashboard-section">
                <div className="section-header">
                    <h3>Department budgets</h3>
                </div>
                <DepartmentBudgets departments={mockDepartments} />
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h3>Recent invoices</h3>
                    <Link to="/invoices" className="section-link">View all →</Link>
                </div>
                <RecentInvoicesTable invoices={mockInvoices} />
            </section>
        </div>
    );
}