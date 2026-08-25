import './RecentInvoicesTable.css';

export default function RecentInvoicesTable({ invoices = [], onStatusChange }) {
    const showActions = Boolean(onStatusChange);

    return (
        <div className="table-wrapper">
            <table className="invoices-table">
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Department</th>
                    <th>Amount</th>
                    <th>Status</th>
                    {showActions && <th>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {invoices.length === 0 ? (
                    <tr>
                        <td colSpan={showActions ? 5 : 4} className="empty-state">
                            No invoices found.
                        </td>
                    </tr>
                ) : (
                    invoices.map((inv) => (
                        <tr key={inv.id}>
                            <td>{inv.description}</td>
                            <td>{inv.departmentName}</td>
                            <td>€{inv.amount.toLocaleString()}</td>
                            <td>
                  <span className={`status-badge ${inv.status.toLowerCase()}`}>
                    {inv.status}
                  </span>
                            </td>
                            {showActions && (
                                <td>
                                    {inv.status === 'Pending' && (
                                        <select
                                            className="status-select"
                                            defaultValue=""
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    onStatusChange(inv.id, e.target.value);
                                                }
                                            }}
                                        >
                                            <option value="" disabled>
                                                Select action...
                                            </option>
                                            <option value="Approved">Approve</option>
                                            <option value="Rejected">Reject</option>
                                        </select>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}