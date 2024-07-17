export const toPrice = (amount: number) => {
  return (amount / 1000).toLocaleString() + (amount > 0 ? "K" : "₫");
};
