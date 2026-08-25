import { useState } from 'react';
import './BudgetsPage.css';

const initialDepartments = [
    { id: '1', name: 'Marketing', currentSpent: 8400, budget: 7000 },
    { id: '2', name: 'Sales', currentSpent: 10800, budget: 12000 },
    { id: '3', name: 'Operations', currentSpent: 7500, budget: 14000 },
    { id: '4', name: 'IT', currentSpent: 4540, budget: 9000 },
];

export default function BudgetsPage() {
    const [departments, setDepartments] = useState(initialDepartments);
    const [isSaved, setIsSaved] = useState(false);

    const handleBudgetChange = (id, newBudget) => {
        setIsSaved(false);
        setDepartments((prev) =>
            prev.map((dept) =>
                dept.id === id ? { ...dept, budget: Math.max(0, Number(newBudget) || 0) } : dept
            )
        );
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const getStatusClass = (spent, budget) => {
        if (spent > budget) return 'status-red';
        if (spent >= budget * 0.8) return 'status-orange';
        return 'status-green';
    };

    return (
        <div className="budgets-page-container">
            <div className="budgets-wrapper">
                <header className="budgets-page-header">
                    <h1>Department Budgets</h1>
                    <p>Set and update spending limits across each company department.</p>
                </header>

                <form className="budgets-form" onSubmit={handleSave}>
                    <div className="budgets-grid">
                        {departments.map((dept) => {
                            const statusClass = getStatusClass(dept.currentSpent, dept.budget);

                            return (
                                <div key={dept.id} className="budget-card">
                                    <div className="budget-card-info">
                                        <span className="dept-name">{dept.name}</span>
                                        <span className="dept-spent">
                      Current Spent:{' '}
                                            <span className={`spent-amount ${statusClass}`}>
                        €{dept.currentSpent.toLocaleString()}
                      </span>
                    </span>
                                    </div>
                                    <div className="budget-input-wrapper">
                                        <span className="currency-symbol">€</span>
                                        <input
                                            type="number"
                                            className="budget-input"
                                            value={dept.budget}
                                            onChange={(e) => handleBudgetChange(dept.id, e.target.value)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="budgets-actions">
                        <button type="submit" className="save-btn">
                            Save changes
                        </button>
                        {isSaved && <span className="save-feedback">✓ Budgets updated</span>}
                    </div>
                </form>
            </div>
        </div>
    );
}