import { useState } from 'react';
import RecentInvoicesTable from '../features/Manager dashboard/components/RecentInvoicesTable/RecentInvoicesTable';
import './InvoicesPage.css';

const initialInvoices = [
    { id: 1, description: 'Google Ads — Oct', departmentName: 'Marketing', amount: 3200, status: 'Pending' },
    { id: 2, description: 'Adobe Creative Cloud', departmentName: 'IT', amount: 299, status: 'Approved' },
    { id: 3, description: 'Office Supplies', departmentName: 'Operations', amount: 450, status: 'Rejected' },
    { id: 4, description: 'AWS Hosting Services', departmentName: 'IT', amount: 1200, status: 'Pending' },
    { id: 5, description: 'Client Catering', departmentName: 'Sales', amount: 380, status: 'Approved' },
];

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState(initialInvoices);
    const [activeTab, setActiveTab] = useState('pending');

    const handleStatusChange = (id, newStatus) => {
        setInvoices((prev) => {
            const targetInvoice = prev.find((inv) => inv.id === id);
            if (!targetInvoice) return prev;

            const updatedInvoice = { ...targetInvoice, status: newStatus };
            const remainingInvoices = prev.filter((inv) => inv.id !== id);

            // Prepend updated invoice so it appears at the top of Processed
            return [updatedInvoice, ...remainingInvoices];
        });
    };

    const pendingInvoices = invoices.filter((inv) => inv.status === 'Pending');
    const processedInvoices = invoices.filter((inv) => inv.status !== 'Pending');

    return (
        <div className="invoices-page-container">
            <header className="invoices-page-header">
                <h1>Invoices</h1>
                <p>Review pending requests or check historical invoice decisions.</p>
            </header>

            <div className="invoices-tabs">
                <button
                    className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending ({pendingInvoices.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'processed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('processed')}
                >
                    Processed ({processedInvoices.length})
                </button>
            </div>

            <div className="invoices-table-section">
                <RecentInvoicesTable
                    invoices={activeTab === 'pending' ? pendingInvoices : processedInvoices}
                    onStatusChange={activeTab === 'pending' ? handleStatusChange : undefined}
                />
            </div>
        </div>
    );
}