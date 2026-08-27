import { useState } from 'react';
import { useApp } from '../context/AppContext';
import RecentInvoicesTable from '../features/Manager dashboard/components/RecentInvoicesTable/RecentInvoicesTable';
import './InvoicesPage.css';

export default function InvoicesPage() {
    const { invoices, updateInvoiceStatus, loading, error } = useApp();
    const [activeTab, setActiveTab] = useState('pending');

    if (loading) {
        return <div className="invoices-page-container"><p>Loading invoices...</p></div>;
    }

    if (error) {
        return <div className="invoices-page-container"><p className="status-red">Error: {error}</p></div>;
    }


    const sortByNewest = (list) => {
        return [...list].sort((a, b) => {
            const timeA = new Date(a.createdAt || a.created_at || a.date || 0).getTime() || Number(a.id) || 0;
            const timeB = new Date(b.createdAt || b.created_at || b.date || 0).getTime() || Number(b.id) || 0;
            return timeB - timeA;
        });
    };

    const pendingInvoices = sortByNewest(
        invoices.filter((inv) => inv.status?.toUpperCase() === 'PENDING')
    );
    const processedInvoices = sortByNewest(
        invoices.filter((inv) => inv.status?.toUpperCase() !== 'PENDING')
    );

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
                    onStatusChange={activeTab === 'pending' ? updateInvoiceStatus : undefined}
                />
            </div>
        </div>
    );
}