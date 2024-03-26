"use client";

import { Button } from '@/components/ui/button';
import { IoSearch } from 'react-icons/io5';
import SearchBox from './search_box';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SearchModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost"><IoSearch size={24} /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] lg:max-w-[960px] xl:max-w-[1024px] 2xl:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Tìm kiếm</DialogTitle>
        </DialogHeader>
        <SearchBox />
      </DialogContent>
    </Dialog>
  );
};
