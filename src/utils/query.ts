export const objectToQueryString = (params: Object): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // Handle array values by joining them with commas
      value.forEach((item) => searchParams.append(key, item));
    } else if (typeof value !== 'undefined') {
      // Exclude undefined values
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};
