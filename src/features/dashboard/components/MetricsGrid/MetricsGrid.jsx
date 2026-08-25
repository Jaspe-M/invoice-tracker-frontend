import StatCard from '../../../../components/StatCard/StatCard';
import './MetricsGrid.css';

export default function MetricsGrid({ metrics = {} }) {
    const {
        totalBudget = 42000,
        totalSpent = 31240,
        pendingInvoices = 7,
        overBudget = 1,
    } = metrics;

    return (
        <div className="metrics-grid">
            <StatCard
                title="Total budget"
                value={`€${totalBudget.toLocaleString()}`}
            />
            <StatCard
                title="Total spent"
                value={`€${totalSpent.toLocaleString()}`}
            />
            <StatCard
                title="Pending invoices"
                value={<span className="metric-warning">{pendingInvoices}</span>}
            />
            <StatCard
                title="Over budget"
                value={<span className="metric-danger">{overBudget}</span>}
            />
        </div>
    );
}