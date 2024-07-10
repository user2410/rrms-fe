type Nullable<T> = { [P in keyof T]: T[P] extends object ? Nullable<T[P]> : T[P] };

export function null2Undefined<T extends object>(obj: Nullable<T>): Nullable<T> {
  const result: Partial<Nullable<T>> = {};
  for (const key in obj) {
    if (obj[key] === null) {
      result[key] = undefined;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = null2Undefined(obj[key] as object) as Nullable<T>[Extract<keyof T, string>];
    } else {
      result[key] = obj[key];
    }
  }
  return result as Nullable<T>;
}
