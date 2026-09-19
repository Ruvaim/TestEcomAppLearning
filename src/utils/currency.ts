export const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};
