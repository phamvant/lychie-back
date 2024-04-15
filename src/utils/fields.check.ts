export function getChangedFields<T extends Record<string, any>>(
  obj1: T,
  obj2: T
): Partial<T> {
  const changedFields: Partial<T> = {};

  // Check keys in obj1
  for (const key in obj1) {
    if (obj1.hasOwnProperty(key) && obj1[key] !== obj2[key]) {
      changedFields[key as keyof T] = obj2[key];
    }
  }

  // Check keys in obj2 (to find keys present in obj2 but not in obj1)
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
      changedFields[key as keyof T] = obj2[key];
    }
  }

  return changedFields;
}
