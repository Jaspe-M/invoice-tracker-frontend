import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import MetricsGrid from './components/MetricsGrid/MetricsGrid';
import DepartmentBudgets from './components/DepartmentBudgets/DepartmentBudgets';
import RecentInvoicesTable from './components/RecentInvoicesTable/RecentInvoicesTable';
import './DashboardSection.css';

export default function DashboardSection() {
    const { dashboardData, loading, error } = useApp();

    if (loading) {
        return <div className="dashboard-container"><p>Loading manager dashboard...</p></div>;
    }

    if (error) {
        return <div className="dashboard-container"><p className="metric-danger">Error: {error}</p></div>;
    }

    const metrics = {
        totalBudget: dashboardData?.totalBudget ?? 0,
        totalSpent: dashboardData?.totalSpent ?? 0,
        pendingInvoices: dashboardData?.pendingInvoices ?? 0,
        overBudget: dashboardData?.overBudgetCount ?? 0,
    };

    const departments = (dashboardData?.departmentBudgets ?? []).map((dept) => ({
        id: dept.id,
        name: dept.name,
        spent: dept.spent,
        budget: dept.budget,
    }));

    const invoices = dashboardData?.recentInvoices ?? [];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Manager Dashboard</h1>
                <p>Overview of current company spending and active budget limits.</p>
            </header>

            <MetricsGrid metrics={metrics} />

            <section className="dashboard-section">
                <div className="section-header">
                    <h3>Department budgets</h3>
                </div>
                <DepartmentBudgets departments={departments} />
            </section>

            <section className="dashboard-section">
                <div className="section-header">
                    <h3>Recent invoices</h3>
                    <Link to="/invoices" className="section-link">View all →</Link>
                </div>
                <RecentInvoicesTable invoices={invoices} />
            </section>
        </div>
    );
}