export const areAllObjectFieldsDefined = (obj: any) =>
  typeof obj === 'object' &&
  Object.values(obj).every((value) => value !== undefined && value !== '');
