export const formatPrice = (price) => {
  return Intl.NumberFormat("bn-bd", {
    style: "currency",
    currency: "BDT",
  }).format(price);
};
