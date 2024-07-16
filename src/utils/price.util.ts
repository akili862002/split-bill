export const toPrice = (amount: number) => {
  return amount / 1000 + (amount > 0 ? "K" : "₫");
};
