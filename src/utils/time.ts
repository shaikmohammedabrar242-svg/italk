export function formatRelativeTime(dateString: string): string {
  try {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return 'yesterday';
    }
    if (diffInDays < 30) {
      return `${diffInDays}d ago`;
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo ago`;
    }
    return `${Math.floor(diffInMonths / 12)}y ago`;
  } catch {
    return 'recently';
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}
