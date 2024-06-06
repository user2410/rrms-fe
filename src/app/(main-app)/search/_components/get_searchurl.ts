import { SearchFormDefaultValues, SearchFormValues } from "../../_components/search_box";

export function getSearchURL(query: Partial<SearchFormValues>) {
  const q = Object.fromEntries(
    Object.entries({
      ...SearchFormDefaultValues,
      ...query,
    }).map(([key, value]) => [
      key,
      value === "" ? undefined : value,
    ])
  );

  return `/search?q=${encodeURIComponent(JSON.stringify(q))}&_r=${new Date().getTime()}`;
}
