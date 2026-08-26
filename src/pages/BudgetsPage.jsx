import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './BudgetsPage.css';

export default function BudgetsPage() {
    const { dashboardData, updateBudget, loading, error } = useApp();
    const [editedBudgets, setEditedBudgets] = useState({});
    const [isSaved, setIsSaved] = useState(false);

    const departmentBudgets = dashboardData?.departmentBudgets || [];

    if (loading) {
        return <div className="budgets-page-container"><p>Loading budgets...</p></div>;
    }

    if (error) {
        return <div className="budgets-page-container"><p className="status-red">Error: {error}</p></div>;
    }

    const handleBudgetChange = (id, newBudget) => {
        setIsSaved(false);
        setEditedBudgets((prev) => ({
            ...prev,
            [id]: Math.max(0, Number(newBudget) || 0),
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        Object.entries(editedBudgets).forEach(([id, budget]) => {
            updateBudget(Number(id), budget);
        });
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
                        {departmentBudgets.map((dept) => {
                            const currentBudget = editedBudgets[dept.id] ?? dept.budget;
                            const statusClass = getStatusClass(dept.spent, currentBudget);

                            return (
                                <div key={dept.id} className="budget-card">
                                    <div className="budget-card-info">
                                        <span className="dept-name">{dept.name}</span>
                                        <span className="dept-spent">
                                            Current Spent:{' '}
                                            <span className={`spent-amount ${statusClass}`}>
                                                €{dept.spent.toLocaleString()}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="budget-input-wrapper">
                                        <span className="currency-symbol">€</span>
                                        <input
                                            type="number"
                                            className="budget-input"
                                            value={currentBudget}
                                            onChange={(e) =>
                                                handleBudgetChange(dept.id, e.target.value)
                                            }
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