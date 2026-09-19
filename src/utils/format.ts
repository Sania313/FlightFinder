export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) {
    return '—';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins}m`;
  }
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

export function formatPrice(price?: number): string {
  if (price == null || !Number.isFinite(price)) {
    return 'Price unavailable';
  }
  return `$${Math.round(price).toLocaleString('en-US')}`;
}

export function formatDateTime(value: string): string {
  if (!value) {
    return '—';
  }
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatStops(stops: number): string {
  if (stops === 0) {
    return 'Non-stop';
  }
  if (stops === 1) {
    return '1 stop';
  }
  return `${stops} stops`;
}
