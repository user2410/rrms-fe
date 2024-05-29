import { SearchFormValues } from "../../_components/search_box";

export function getSearchURL(query: Partial<SearchFormValues>) {
  return `/search?q=${encodeURIComponent(JSON.stringify(query))}`;
}
