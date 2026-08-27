import Card from '../Card/Card';
import './StatCard.css';

export default function StatCard({ title, value, className = '' }) {
    const numValue = Number(String(value ?? 0).replace(/[^0-9.-]/g, '')) || 0;
    const lowerTitle = (title || '').toLowerCase();

    let colorClass = '';
    if (lowerTitle.includes('pending') && numValue > 0) {
        colorClass = 'stat-value-orange';
    } else if (lowerTitle.includes('over budget') && numValue > 0) {
        colorClass = 'stat-value-red';
    }

    return (
        <Card className={`stat-card ${className}`.trim()}>
            <span className="stat-card-title">{title}</span>
            <span className={`stat-card-value ${colorClass}`.trim()}>
                {value}
            </span>
        </Card>
    );
}