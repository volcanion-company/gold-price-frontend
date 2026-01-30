export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price);
}

export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${formatPrice(change)}`;
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('vi-VN');
}
