import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DepartmentBudgets from '../features/Manager dashboard/components/DepartmentBudgets/DepartmentBudgets';
import RecentInvoicesTable from '../features/Manager dashboard/components/RecentInvoicesTable/RecentInvoicesTable';
import './DepartmentsPage.css';

export default function DepartmentsPage() {
    const { dashboardData, invoices, loading, error } = useApp();
    const { departmentId } = useParams();
    const navigate = useNavigate();

    if (loading) {
        return <div className="departments-page-container"><p>Loading departments...</p></div>;
    }

    if (error) {
        return <div className="departments-page-container"><p className="status-red">Error: {error}</p></div>;
    }

    const departments = (dashboardData?.departmentBudgets ?? []).map((dept) => ({
        id: dept.id,
        name: dept.name,
        spent: dept.spent,
        budget: dept.budget,
    }));

    const activeId = departmentId || (departments[0]?.id ? String(departments[0].id) : '1');

    const handleSelectDepartment = (id) => {
        navigate(`/departments/${id}`);
    };

    const selectedDepartment =
        departments.find((d) => String(d.id) === String(activeId)) || departments[0];

    const filteredInvoices = invoices.filter(
        (inv) =>
            (inv.departmentName || inv.department?.name || '').toLowerCase() ===
            (selectedDepartment?.name || '').toLowerCase()
    );

    return (
        <div className="departments-page-container">
            <header className="departments-page-header">
                <h1>Departments</h1>
                <p>Filter budgets and invoices by department.</p>
            </header>

            <div className="department-tabs">
                {departments.map((dept) => (
                    <button
                        key={dept.id}
                        className={`dept-tab-btn ${String(activeId) === String(dept.id) ? 'active' : ''}`}
                        onClick={() => handleSelectDepartment(dept.id)}
                    >
                        {dept.name}
                    </button>
                ))}
            </div>

            {selectedDepartment && (
                <section className="department-budget-overview">
                    <DepartmentBudgets departments={[selectedDepartment]} />
                </section>
            )}

            <section className="department-invoices-section">
                <h3>{selectedDepartment?.name} Invoices</h3>
                <RecentInvoicesTable invoices={filteredInvoices} />
            </section>
        </div>
    );
}