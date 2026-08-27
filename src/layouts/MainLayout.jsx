import { Outlet } from 'react-router-dom';
import Sidebar from '../features/Manager dashboard/components/Sidebar/Sidebar';
import InvoiceSubmissionSection from '../features/Employee dashboard/InvoiceSubmissionSection';
import './MainLayout.css';

export default function MainLayout() {
    return (
        <div className="main-layout-wrapper">
            <div className="main-content-frame">
                <div className="dashboard-layout">
                    <Sidebar />
                    <div className="page-content">
                        <Outlet />
                    </div>
                </div>
            </div>

            <InvoiceSubmissionSection />
        </div>
    );
}