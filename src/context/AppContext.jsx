import { createContext, useContext, useState, useEffect } from 'react';
import { getManagerDashboard } from '../services/dashboardService';
import { getDepartments } from '../services/departmentService';
import { getInvoices } from '../services/invoiceService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const [dashData, deptsData, invoicesData] = await Promise.all([
                    getManagerDashboard(),
                    getDepartments(),
                    getInvoices(),
                ]);
                setDashboardData(dashData);
                setDepartments(deptsData);
                setInvoices(invoicesData);
            } catch (err) {
                setError(err.message || 'Failed to load initial data');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const addInvoice = (newInvoice) => {
        const amount = parseFloat(newInvoice.amount);
        const deptId = Number(newInvoice.departmentId);

        const dept = departments.find((d) => d.id === deptId);
        const deptName = dept ? dept.name : 'Unknown';

        const createdInvoice = {
            id: Date.now(),
            description: newInvoice.description,
            amount,
            status: 'PENDING',
            departmentName: deptName,
            createdAt: new Date().toISOString(),
        };

        setInvoices((prev) => [createdInvoice, ...prev]);

        setDashboardData((prev) => {
            if (!prev) return prev;

            const updatedDeptBudgets = prev.departmentBudgets.map((db) => {
                if (db.id === deptId) {
                    return { ...db, spent: db.spent + amount };
                }
                return db;
            });

            const updatedTotalSpent = prev.totalSpent + amount;
            const updatedPending = prev.pendingInvoices + 1;
            const updatedOverBudgetCount = updatedDeptBudgets.filter(
                (db) => db.spent > db.budget
            ).length;

            return {
                ...prev,
                totalSpent: updatedTotalSpent,
                pendingInvoices: updatedPending,
                overBudgetCount: updatedOverBudgetCount,
                departmentBudgets: updatedDeptBudgets,
                recentInvoices: [createdInvoice, ...prev.recentInvoices],
            };
        });
    };

    const updateInvoiceStatus = (id, newStatus) => {
        setInvoices((prev) => {
            const target = prev.find((inv) => inv.id === id);
            if (!target) return prev;
            const updated = { ...target, status: newStatus };
            const rest = prev.filter((inv) => inv.id !== id);
            return [updated, ...rest];
        });

        setDashboardData((prev) => {
            if (!prev) return prev;

            const target = prev.recentInvoices.find((inv) => inv.id === id);
            let updatedRecentInvoices = prev.recentInvoices;

            if (target) {
                const updated = { ...target, status: newStatus };
                const rest = prev.recentInvoices.filter((inv) => inv.id !== id);
                updatedRecentInvoices = [updated, ...rest];
            }

            const pendingCount = updatedRecentInvoices.filter(
                (inv) => inv.status?.toUpperCase() === 'PENDING'
            ).length;

            return {
                ...prev,
                pendingInvoices: pendingCount,
                recentInvoices: updatedRecentInvoices,
            };
        });
    };

    const updateBudget = (departmentId, newBudget) => {
        const budgetVal = parseFloat(newBudget);

        setDepartments((prev) =>
            prev.map((d) => (d.id === departmentId ? { ...d, budget: budgetVal } : d))
        );

        setDashboardData((prev) => {
            if (!prev) return prev;

            const updatedDeptBudgets = prev.departmentBudgets.map((db) => {
                if (db.id === departmentId) {
                    return { ...db, budget: budgetVal };
                }
                return db;
            });

            const newTotalBudget = updatedDeptBudgets.reduce(
                (acc, db) => acc + db.budget,
                0
            );
            const updatedOverBudgetCount = updatedDeptBudgets.filter(
                (db) => db.spent > db.budget
            ).length;

            return {
                ...prev,
                totalBudget: newTotalBudget,
                overBudgetCount: updatedOverBudgetCount,
                departmentBudgets: updatedDeptBudgets,
            };
        });
    };

    return (
        <AppContext.Provider
            value={{
                dashboardData,
                departments,
                invoices,
                loading,
                error,
                addInvoice,
                updateInvoiceStatus,
                updateBudget,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);