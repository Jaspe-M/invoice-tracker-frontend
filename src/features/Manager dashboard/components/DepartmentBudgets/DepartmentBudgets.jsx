import './DepartmentBudgets.css';

export default function DepartmentBudgets({ departments = [] }) {
    if (departments.length === 0) {
        return <div className="dept-empty">No department budgets available.</div>;
    }

    return (
        <div className="dept-list">
            {departments.map((dept) => {
                const isOver = dept.spent > dept.budget;
                const rawPercentage = Math.round((dept.spent / dept.budget) * 100);
                const barWidth = Math.min(rawPercentage, 100);
                const remaining = dept.budget - dept.spent;

                // Decides status bar color
                let statusColor = '#22c55e';
                let statusText = `${rawPercentage}% used — €${remaining.toLocaleString()} remaining`;

                if (isOver) {
                    statusColor = '#ef4444';
                    statusText = `Over budget by €${Math.abs(remaining).toLocaleString()}`;
                } else if (rawPercentage >= 80) {
                    statusColor = '#f59e0b';
                }

                return (
                    <div key={dept.id || dept.name} className="dept-card">
                        <div className="dept-header">
                            <span className="dept-name">{dept.name}</span>
                            <span className="dept-values">
                            €{dept.spent.toLocaleString()} / €{dept.budget.toLocaleString()}
                            </span>
                        </div>

                        {/* progress bar */}
                        <div className="dept-bar-track">
                            <div
                                className="dept-bar-fill"
                                style={{
                                    width: `${barWidth}%`,
                                    backgroundColor: statusColor,
                                }}
                            />
                        </div>

                        {/* Status beneath progress bar */}
                        <div className="dept-status" style={{ color: statusColor }}>
                            {statusText}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}