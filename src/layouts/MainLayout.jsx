import { Outlet } from 'react-router-dom';
import Sidebar from '../features/Manager dashboard/components/Sidebar/Sidebar';
import './MainLayout.css';

export default function MainLayout() {
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="layout-content">
                <Outlet />
            </main>
        </div>
    );
}