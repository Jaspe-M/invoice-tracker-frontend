import { useNavigate } from 'react-router-dom';
import './DepartmentBudgets.css';

export default function DepartmentBudgets({ departments = [] }) {
    const navigate = useNavigate();

    const getStatusClass = (spent, budget) => {
        if (spent > budget) return 'red';
        if (spent >= budget * 0.8) return 'orange';
        return 'green';
    };

    return (
        <div className="department-budgets-grid">
            {departments.map((dept) => {
                const percentage = Math.min(Math.round((dept.spent / dept.budget) * 100), 100);
                const statusClass = getStatusClass(dept.spent, dept.budget);

                return (
                    <div
                        key={dept.id}
                        className="department-card"
                        onClick={() => navigate(`/departments/${dept.id}`)}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="card-header">
                            <span className="dept-title">{dept.name}</span>
                            <span className="dept-values">
                <strong>€{dept.spent.toLocaleString()}</strong> / €{dept.budget.toLocaleString()}
              </span>
                        </div>

                        <div className="progress-bar-bg">
                            <div
                                className={`progress-bar-fill ${statusClass}`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}