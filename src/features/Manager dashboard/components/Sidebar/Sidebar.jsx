import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCubes,
    faFileLines,
    faWallet,
    faBuildingCircleCheck
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const navItems = [
    { label: 'Dashboard', icon: faCubes, path: '/' },
    { label: 'Invoices', icon: faFileLines, path: '/invoices' },
    { label: 'Budgets', icon: faWallet, path: '/budgets' },
    { label: 'Departments', icon: faBuildingCircleCheck, path: '/departments' },
];

export default function Sidebar({ user = { name: 'Jaspe Matumona', role: 'Finance Manager', initials: 'JM' } }) {
    return (
        <aside className="sidebar">
            <div>
                <div className="sidebar-brand">
                    <h2 className="brand-title">NovaTech BV</h2>
                    <span className="brand-subtitle">Budget Tracker</span>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="sidebar-user">
                <div className="user-avatar">{user.initials}</div>
                <div className="user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-role">{user.role}</div>
                </div>
            </div>
        </aside>
    );
}