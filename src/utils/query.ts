export const objectToQueryString = (params: Object): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Handle array values by joining them with commas
      value.forEach((item) => {if(item){searchParams.append(key, item);}});
    } else if (typeof value !== 'undefined') {
      // Exclude undefined values
      if(value){searchParams.append(key, String(value));}
    }
  });

  return searchParams.toString() + `&_r=${new Date().getTime()}`;
};

// convert null fields of an object to undefined
export function nullFieldsToUndefined<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj), (key, value) => {
    if (value === null) {
      return undefined;
    }
    return value;
  });
};
