import MainLayout from './layouts/MainLayout';
import DashboardSection from './features/dashboard/DashboardSection';
import InvoiceSubmissionSection from './features/invoices/InvoiceSubmissionSection';

export default function App() {
    return (
        <MainLayout>
            <DashboardSection />
            <InvoiceSubmissionSection />
        </MainLayout>
    );
}