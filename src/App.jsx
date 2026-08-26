import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import InvoicesPage from './pages/InvoicesPage';
import BudgetsPage from './pages/BudgetsPage';
import DepartmentsPage from './pages/DepartmentsPage';

export default function App() {
    return (
        <AppProvider>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="invoices" element={<InvoicesPage />} />
                    <Route path="budgets" element={<BudgetsPage />} />
                    <Route path="departments" element={<DepartmentsPage />} />
                    <Route path="departments/:departmentId" element={<DepartmentsPage />} />
                </Route>
            </Routes>
        </AppProvider>
    );
}