import './MainLayout.css';

export default function MainLayout({ children }) {
    return (
        <main className="layout-container">
            {children}
        </main>
    );
}