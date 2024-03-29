"use client";

import useDebounce from '@/hooks/use-debounce';
import { City, District, Ward } from '@/models/dghcvn';
import { FuzzySearch } from '@/utils/dghcvn';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@components/ui/command';
import { Input, InputProps } from '@components/ui/input';
import { ChangeEvent, forwardRef, useEffect, useState } from 'react';

type SearchSuggestionItem = {
  cities: City[];
  districts: (District & {cityName: string})[];
  wards: (Ward & {cityId: string, cityName: string, districtName: string})[];
}

const SearchbarSuggestion = forwardRef<HTMLInputElement, InputProps>(
  function Render({ className, type, ...props }, ref) {
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedValue = useDebounce(searchValue, 500);
    const [activeSearch, setActiveSearch] = useState<SearchSuggestionItem | null>(null);
    const [enableSuggestion, setEnableSuggestion] = useState<boolean>(true);

    useEffect(() => {
      if(debouncedValue.length < 2) {
        setActiveSearch(null);
        return;
      }
      if(!enableSuggestion) {
        setActiveSearch(null);
        setEnableSuggestion(true);
        return;
      }

      let ignore = false;
      const data = FuzzySearch(debouncedValue, 2);
      if(!ignore) setActiveSearch(data);

      return () => { ignore = true; };
    }, [debouncedValue]);

    return (
      <div className='relative'>
        <input
          type={type}
          ref={ref}
          {...props}
          value={searchValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
          className="h-10 w-full px-3 py-2 text-sm rounded-md ring-0 focus-visible:ring-0"
        />
        {
          activeSearch && (
            <div className="absolute z-10 top-10 w-full overflow-hidden">
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Tìm nhanh..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {activeSearch.wards.length > 0 && (
                    <CommandGroup heading="Phường, xã">
                      {activeSearch.wards.map((w, i) => (
                        <CommandItem key={i} className="hover:cursor-pointer"
                          onSelect={(value) => {
                            console.log("select ward", value);
                            setSearchValue(`${w.name}, ${w.districtName}, ${w.cityName}`);
                            setEnableSuggestion(false);
                          }}>
                          <span>{`${w.name}, ${w.districtName}, ${w.cityName}`}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {activeSearch.districts.length > 0 && (
                    <>  
                      <CommandSeparator/>
                      <CommandGroup heading="Quận, huyện">
                        {activeSearch.districts.map((d, i) => (
                          <CommandItem key={i} className="hover:cursor-pointer"
                            onSelect={(value) => {
                              console.log("select district", value);
                              setSearchValue(`${d.name}, ${d.cityName}`);
                              setEnableSuggestion(false);
                            }}>
                            <span>{`${d.name}, ${d.cityName}`}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
                  {activeSearch.cities.length > 0 && (
                    <>  
                      <CommandSeparator/>
                      <CommandGroup heading="Thành phố">
                        {activeSearch.cities.map((c, i) => (
                          <CommandItem key={i} className="hover:cursor-pointer"
                            onSelect={(value) => {
                              console.log("select city", value);
                              setSearchValue(`${c.name}`);
                              setEnableSuggestion(false);
                            }}>
                            <span>{c.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>  
                  )}
                </CommandList>
              </Command>
            </div>
          )
        }
      </div>
    );
  }
);

export default SearchbarSuggestion;

{/* <div className=" rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2">
  {
    activeSearch.map((s, i) => (
      <span key={i}>{s}</span>
    ))
  }
</div> */}
