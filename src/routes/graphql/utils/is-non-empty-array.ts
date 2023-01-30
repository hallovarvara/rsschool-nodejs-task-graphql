export const isNonEmptyArray = (arr?: any): arr is object =>
  Array.isArray(arr) && arr.length > 0;
