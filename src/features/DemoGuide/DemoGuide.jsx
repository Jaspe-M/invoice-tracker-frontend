import './DemoGuide.css';

export default function DemoGuide() {
    return (
        <aside className="guide-container">
            <div className="guide-header">
                <span className="guide-pill">Interactive Demo</span>
                <h2>Try These Tasks</h2>
            </div>
            <ol className="guide-checklist">
                <li className="guide-item">
                    <span className="guide-title">Process Invoices</span>
                    <p className="guide-desc">Approve the pending item under <em>Invoices</em>.</p>
                </li>
                <li className="guide-item">
                    <span className="guide-title">Fix Over-Budget Warning</span>
                    <p className="guide-desc">Raise Marketing's limit in <em>Budgets</em> to clear the "over budget" alert.</p>
                </li>
                <li className="guide-item">
                    <span className="guide-title">Test Warning Thresholds</span>
                    <p className="guide-desc">Submit and accepts invoices until all departments reaches 80% of its budget (turns orange).</p>
                </li>
                <li className="guide-item">
                    <span className="guide-title">Reject Submissions</span>
                    <p className="guide-desc">Try declining an incoming invoice submission.</p>
                </li>
                <li className="guide-item">
                    <span className="guide-title">Test the shortcuts</span>
                    <p className="guide-desc">Jump straight to a department's invoices by clicking its card in <em>Dashboard</em>.</p>
                </li>
            </ol>
        </aside>
    );
}