import Card from '../Card/Card';
import './StatCard.css';

export default function StatCard({ title, value, className = '' }) {
    // Gezet naar getal (veilig voor 0, "0", €-tekens, etc.)
    const numValue = Number(String(value ?? 0).replace(/[^0-9.-]/g, '')) || 0;
    const lowerTitle = (title || '').toLowerCase();

    let colorClass = '';
    // Enkel oranje/rood als het getal groter is dan 0, anders blijft het standaard (wit)
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