import Card from '../Card/Card';
import './StatCard.css';

export default function StatCard({ title, value, className = '' }) {
    return (
        <Card className={`stat-card ${className}`.trim()}>
            <span className="stat-card-title">{title}</span>
            <span className="stat-card-value">{value}</span>
        </Card>
    );
}