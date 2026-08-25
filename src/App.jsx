import MainLayout from './layouts/MainLayout';
import DashboardSection from './features/Manager dashboard/DashboardSection';
import InvoiceSubmissionSection from './features/Employee dashboard/InvoiceSubmissionSection';

export default function App() {
    return (
        <MainLayout>
            <DashboardSection />
            <InvoiceSubmissionSection />
        </MainLayout>
    );
}