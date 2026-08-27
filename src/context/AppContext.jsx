import { createContext, useContext, useState, useEffect } from 'react';
import { getManagerDashboard } from '../services/dashboardService';
import { getDepartments } from '../services/departmentService';
import { getInvoices } from '../services/invoiceService';

const AppContext = createContext();


const parseAmount = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
};


const extractDeptInfo = (invoice) => {
    let id = invoice.departmentId || invoice.department_id || null;
    let name = invoice.departmentName || invoice.department_name || null;

    if (typeof invoice.department === 'object' && invoice.department !== null) {
        id = id || invoice.department.id;
        name = name || invoice.department.name;
    } else if (typeof invoice.department === 'string') {
        name = name || invoice.department;
    }

    return {
        id: id ? String(id).toLowerCase() : null,
        name: name ? String(name).toLowerCase() : null,
    };
};

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
        const amount = parseAmount(newInvoice.amount);
        const deptId = Number(newInvoice.departmentId);

        const dept =
            dashboardData?.departmentBudgets?.find((d) => String(d.id) === String(deptId)) ||
            departments.find((d) => String(d.id) === String(deptId));
        const deptName = dept ? dept.name : 'Unknown';

        const createdInvoice = {
            id: Date.now(),
            description: newInvoice.description,
            amount,
            status: 'PENDING',
            departmentId: deptId,
            departmentName: deptName,
            department: { id: deptId, name: deptName },
            createdAt: new Date().toISOString(),
        };

        setInvoices((prev) => [createdInvoice, ...prev]);

        setDashboardData((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                pendingInvoices: prev.pendingInvoices + 1,
                recentInvoices: [createdInvoice, ...(prev.recentInvoices || [])].slice(0, 2),
            };
        });
    };

    const updateInvoiceStatus = (id, newStatus) => {
        const targetInvoice =
            invoices.find((inv) => String(inv.id) === String(id)) ||
            dashboardData?.recentInvoices?.find((inv) => String(inv.id) === String(id));

        if (!targetInvoice) return;

        const oldStatus = targetInvoice.status?.toUpperCase();
        const nextStatus = newStatus.toUpperCase();
        const invoiceAmount = parseAmount(targetInvoice.amount);

        const { id: targetDeptId, name: targetDeptName } = extractDeptInfo(targetInvoice);


        setInvoices((prev) => {
            const target = prev.find((inv) => String(inv.id) === String(id)) || targetInvoice;
            const updated = { ...target, status: newStatus };
            const rest = prev.filter((inv) => String(inv.id) !== String(id));
            return [updated, ...rest];
        });

        setDashboardData((prev) => {
            if (!prev) return prev;

            const targetRecent = (prev.recentInvoices || []).find((inv) => String(inv.id) === String(id)) || targetInvoice;
            const updatedRecent = { ...targetRecent, status: newStatus };
            const restRecent = (prev.recentInvoices || []).filter((inv) => String(inv.id) !== String(id));
            const updatedRecentInvoices = [updatedRecent, ...restRecent].slice(0, 2);

            const pendingCount = (invoices || []).filter((inv) => {
                const currentStatus = String(inv.id) === String(id) ? newStatus : inv.status;
                return currentStatus?.toUpperCase() === 'PENDING';
            }).length;

            let updatedTotalSpent = prev.totalSpent;
            let updatedDeptBudgets = [...(prev.departmentBudgets || [])];

            const isMatchingDept = (db) => {
                const dbId = String(db.id).toLowerCase();
                const dbName = String(db.name).toLowerCase();
                return dbId === targetDeptId || dbName === targetDeptName;
            };

            if (oldStatus !== 'APPROVED' && nextStatus === 'APPROVED') {
                updatedTotalSpent += invoiceAmount;
                updatedDeptBudgets = updatedDeptBudgets.map((db) => {
                    if (isMatchingDept(db)) {
                        return { ...db, spent: db.spent + invoiceAmount };
                    }
                    return db;
                });
            } else if (oldStatus === 'APPROVED' && nextStatus !== 'APPROVED') {
                updatedTotalSpent = Math.max(0, updatedTotalSpent - invoiceAmount);
                updatedDeptBudgets = updatedDeptBudgets.map((db) => {
                    if (isMatchingDept(db)) {
                        return { ...db, spent: Math.max(0, db.spent - invoiceAmount) };
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
        const budgetVal = parseAmount(newBudget);

        setDepartments((prev) =>
            prev.map((d) => (String(d.id) === String(departmentId) ? { ...d, budget: budgetVal } : d))
        );

        setDashboardData((prev) => {
            if (!prev) return prev;

            const updatedDeptBudgets = prev.departmentBudgets.map((db) => {
                if (String(db.id) === String(departmentId)) {
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