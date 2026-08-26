import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './InvoiceSubmissionSection.css';

export default function InvoiceSubmissionSection() {
    const { dashboardData, departments, addInvoice } = useApp();

    const [departmentId, setDepartmentId] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const availableDepartments =
        dashboardData?.departmentBudgets?.length > 0
            ? dashboardData.departmentBudgets
            : departments;

    const activeDeptId = departmentId || availableDepartments[0]?.id || '';

    const selectedDeptData = availableDepartments.find(
        (d) => String(d.id) === String(activeDeptId)
    );

    const deptSpent = selectedDeptData?.spent ?? 0;
    const deptBudget = selectedDeptData?.budget ?? 0;

    const getSpentColorClass = (spent, budget) => {
        if (!budget || budget <= 0) return 'green';
        const ratio = spent / budget;
        if (ratio > 1) return 'red';
        if (ratio >= 0.8) return 'orange';
        return 'green';
    };

    const spentColorClass = getSpentColorClass(deptSpent, deptBudget);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description.trim() || !amount || parseFloat(amount) <= 0) return;

        addInvoice({
            departmentId: Number(activeDeptId),
            description: description.trim(),
            amount: parseFloat(amount),
        });

        setDescription('');
        setAmount('');
    };

    return (
        <div className="invoice-submission-card">
            <div className="invoice-submission-header">
                <h2>NovaTech BV — Employee Dashboard</h2>
            </div>

            <div className="invoice-submission-body">
                <h3>Submit an invoice</h3>
                <p className="subtitle">
                    Fill in the form below. The finance manager will review your submission.
                </p>

                <form onSubmit={handleSubmit} className="invoice-form-card">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Department</label>
                            <select
                                value={activeDeptId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                className="form-input"
                            >
                                {availableDepartments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group flex-grow">
                            <label>Description</label>
                            <input
                                type="text"
                                placeholder="e.g. Adobe Creative Cloud licence..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group amount-group">
                            <label>Amount (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn">
                            Add invoice
                        </button>
                    </div>

                    {selectedDeptData && (
                        <div className="dept-stats-badge">
                            <div className={`stat-col ${spentColorClass}`}>
                                <span className="stat-label">SPENT</span>
                                <span className="stat-value">€{deptSpent.toLocaleString()}</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-col">
                                <span className="stat-label">BUDGET</span>
                                <span className="stat-value">€{deptBudget.toLocaleString()}</span>
                            </div>
                            <div className="dept-tag">
                                {selectedDeptData.name} — {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}