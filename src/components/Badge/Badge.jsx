import './Badge.css';

export default function Badge({ children, status = 'default' }) {
    const normalizedStatus = status.toLowerCase();

    let statusClass = 'badge-default'; /*fallback for if api not responding*/
    if (normalizedStatus === 'pending') {
        statusClass = 'badge-pending';
    } else if (normalizedStatus === 'approved') {
        statusClass = 'badge-approved';
    } else if (normalizedStatus === 'rejected') {
        statusClass = 'badge-rejected';
    }

    return (
        <span className={`badge ${statusClass}`}>
      {children}
    </span>
    );
}