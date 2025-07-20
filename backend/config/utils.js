export function getProductStatus(expiryDate) {
  const now = new Date();
  const expDate = new Date(expiryDate);
  const oneMonthLater = new Date(now);
  oneMonthLater.setMonth(now.getMonth() + 1);
  if (expDate <= now) return 'Expired';
  if (expDate <= oneMonthLater) return 'Expiring';
  return 'Fresh';
}