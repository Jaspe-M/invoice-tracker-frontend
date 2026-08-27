import { Outlet } from 'react-router-dom';
import Sidebar from '../features/Manager dashboard/components/Sidebar/Sidebar';
import InvoiceSubmissionSection from '../features/Employee dashboard/InvoiceSubmissionSection';
import DemoGuide from '../features/DemoGuide/DemoGuide'; // Update path if placed in a subfolder
import './MainLayout.css';

export default function MainLayout() {
    return (
        <div className="app-container">

            <div className="demo-wrapper">
                <DemoGuide />
            </div>

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
        </div>
    );
}