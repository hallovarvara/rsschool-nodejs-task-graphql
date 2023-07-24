export const getNoEntityIdErrorMessage = (id?: string): string =>
  id
    ? `Entity with id "${id}" does not exist`
    : 'Entity with this id does not exist';

export const getNoEntityIdxErrorMessage = (...idx: string[]): string =>
  !idx || idx.length === 0
    ? 'Some of specified entities idx do not exist'
    : `Some of specified entities idx do not exist: ${idx.join(', ')}`;

export const getNoRequiredFieldsErrorMessage = (...fields: string[]) =>
  !fields || fields.length === 0
    ? 'Add required fields'
    : `Add required fields: ${fields.join(', ')}`;