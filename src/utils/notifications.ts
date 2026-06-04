export function formatRelativeTime(iso?: string): string {
  if (!iso) return '';

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return `${Math.max(diffSec, 1)}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;

  return date.toLocaleDateString();
}

export function notificationIcon(type?: string): string {
  switch (type?.toLowerCase()) {
    case 'asset':
    case 'processing':
      return '✓';
    case 'member':
    case 'user':
      return '👤';
    case 'apikey':
    case 'api_key':
    case 'security':
      return '🔑';
    case 'content':
    case 'entry':
    case 'update':
      return '✏️';
    case 'delete':
    case 'deleted':
      return '🗑';
    case 'login':
      return '🔔';
    default:
      return '🔔';
  }
}
