export const formatPrice = (price) => {
  return `$${Number(price).toLocaleString()}`;
};

export const formatPriceWithCurrency = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
