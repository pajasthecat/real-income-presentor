export const parseIntFromCurrency = (price) =>
  Number(price.replace(/[^0-9\.]+/g, ""));
