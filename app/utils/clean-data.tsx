export function removeEmptyProperties<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = { ...obj };
  
  (Object.keys(result) as Array<keyof T>).forEach((key) => {
    const value = result[key];
    if (value === '' || value === null || value === undefined) {
      delete result[key];
    }
  });
  
  return result;
}