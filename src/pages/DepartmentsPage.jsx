import { useParams, useNavigate } from 'react-router-dom';
import DepartmentBudgets from '../features/Manager dashboard/components/DepartmentBudgets/DepartmentBudgets';
import RecentInvoicesTable from '../features/Manager dashboard/components/RecentInvoicesTable/RecentInvoicesTable';
import './DepartmentsPage.css';

const mockDepartments = [
    { id: '1', name: 'Marketing', spent: 8400, budget: 7000 },
    { id: '2', name: 'Sales', spent: 10800, budget: 12000 },
    { id: '3', name: 'Operations', spent: 7500, budget: 14000 },
    { id: '4', name: 'IT', spent: 4540, budget: 9000 },
];

const mockInvoices = [
    { id: 1, description: 'Google Ads — Oct', departmentName: 'Marketing', amount: 3200, status: 'Pending' },
    { id: 2, description: 'Social Media Campaign', departmentName: 'Marketing', amount: 5200, status: 'Approved' },
    { id: 3, description: 'Client Catering', departmentName: 'Sales', amount: 380, status: 'Approved' },
    { id: 4, description: 'CRM Subscription', departmentName: 'Sales', amount: 10420, status: 'Approved' },
    { id: 5, description: 'Office Supplies', departmentName: 'Operations', amount: 450, status: 'Rejected' },
    { id: 6, description: 'Logistics Software', departmentName: 'Operations', amount: 7050, status: 'Approved' },
    { id: 7, description: 'Adobe Creative Cloud', departmentName: 'IT', amount: 299, status: 'Approved' },
    { id: 8, description: 'AWS Hosting Services', departmentName: 'IT', amount: 4241, status: 'Pending' },
];

export default function DepartmentsPage() {
    const { departmentId } = useParams();
    const navigate = useNavigate();

    // Derive state directly from URL param (no useState/useEffect needed)
    const selectedId = departmentId || '1';

    const handleSelectDepartment = (id) => {
        navigate(`/departments/${id}`);
    };

    const selectedDepartment =
        mockDepartments.find((d) => String(d.id) === String(selectedId)) || mockDepartments[0];

    const filteredInvoices = mockInvoices.filter(
        (inv) =>
            inv.departmentName.toLowerCase() === (selectedDepartment?.name || '').toLowerCase()
    );

    return (
        <div className="departments-page-container">
            <header className="departments-page-header">
                <h1>Departments</h1>
                <p>Filter budgets and invoices by department.</p>
            </header>

            <div className="department-tabs">
                {mockDepartments.map((dept) => (
                    <button
                        key={dept.id}
                        className={`dept-tab-btn ${String(selectedId) === String(dept.id) ? 'active' : ''}`}
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