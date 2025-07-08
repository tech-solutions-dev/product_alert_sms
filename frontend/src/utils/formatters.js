import { DATE_FORMATS } from './constants';

export function formatDate(date, format = DATE_FORMATS.DISPLAY) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString();
}

export function formatNumber(num) {
  return Number(num).toLocaleString();
}
