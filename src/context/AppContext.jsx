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

        const dept =
            dashboardData?.departmentBudgets?.find((d) => d.id === deptId) ||
            departments.find((d) => d.id === deptId);
        const deptName = dept ? dept.name : 'Unknown';

        const createdInvoice = {
            id: Date.now(),
            description: newInvoice.description,
            amount,
            status: 'PENDING',
            departmentId: deptId,
            departmentName: deptName,
            createdAt: new Date().toISOString(),
        };

        // Prepend new pending invoice
        setInvoices((prev) => [createdInvoice, ...prev]);

        // Increment pending counter without modifying spent/budget metrics
        setDashboardData((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                pendingInvoices: prev.pendingInvoices + 1,
                recentInvoices: [createdInvoice, ...prev.recentInvoices],
            };
        });
    };

    const updateInvoiceStatus = (id, newStatus) => {
        const targetInvoice = invoices.find((inv) => inv.id === id);
        if (!targetInvoice) return;

        const oldStatus = targetInvoice.status?.toUpperCase();
        const nextStatus = newStatus.toUpperCase();

        // 1. Prepend to top of central invoices list
        setInvoices((prev) => {
            const target = prev.find((inv) => inv.id === id);
            if (!target) return prev;
            const updated = { ...target, status: newStatus };
            const rest = prev.filter((inv) => inv.id !== id);
            return [updated, ...rest];
        });

        // 2. Sync metrics & recentInvoices in dashboardData
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

            let updatedTotalSpent = prev.totalSpent;
            let updatedDeptBudgets = [...prev.departmentBudgets];

            // Add amount to spent only when status changes to APPROVED
            if (oldStatus !== 'APPROVED' && nextStatus === 'APPROVED') {
                updatedTotalSpent += targetInvoice.amount;
                updatedDeptBudgets = updatedDeptBudgets.map((db) => {
                    if (
                        db.id === targetInvoice.departmentId ||
                        db.name.toLowerCase() === targetInvoice.departmentName?.toLowerCase()
                    ) {
                        return { ...db, spent: db.spent + targetInvoice.amount };
                    }
                    return db;
                });
            }
            // Deduct amount if previously APPROVED invoice gets changed
            else if (oldStatus === 'APPROVED' && nextStatus !== 'APPROVED') {
                updatedTotalSpent = Math.max(0, updatedTotalSpent - targetInvoice.amount);
                updatedDeptBudgets = updatedDeptBudgets.map((db) => {
                    if (
                        db.id === targetInvoice.departmentId ||
                        db.name.toLowerCase() === targetInvoice.departmentName?.toLowerCase()
                    ) {
                        return { ...db, spent: Math.max(0, db.spent - targetInvoice.amount) };
                    }
                    return db;
                });
            }

            const updatedOverBudgetCount = updatedDeptBudgets.filter(
                (db) => db.spent > db.budget
            ).length;

            return {
                ...prev,
                totalSpent: updatedTotalSpent,
                pendingInvoices: pendingCount,
                overBudgetCount: updatedOverBudgetCount,
                departmentBudgets: updatedDeptBudgets,
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