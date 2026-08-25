import Badge from '../../../../components/Badge/Badge';
import './RecentInvoicesTable.css';

export default function RecentInvoicesTable({ invoices = [] }) {
    if (invoices.length === 0) {
        return <div className="empty-state">No invoices found.</div>;
    }

    return (
        <div className="recent-invoices-container">
            <table className="recent-invoices-table">
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Department</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                        <td className="col-description">{invoice.description}</td>
                        <td className="col-department">{invoice.departmentName || invoice.department}</td>
                        <td className="col-amount">€{Number(invoice.amount).toLocaleString()}</td>
                        <td className="col-status">
                            <Badge status={invoice.status}>
                                {invoice.status}
                            </Badge>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}