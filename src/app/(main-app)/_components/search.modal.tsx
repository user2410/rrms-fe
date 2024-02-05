"use client";

import styles from "../_styles/search_modal.module.css";
import { Button } from '@/components/ui/button';
import { IoSearch } from 'react-icons/io5';
import SearchBox from './landing-page/search_box';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function SearchModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost"><IoSearch size={24} /></Button>
      </DialogTrigger>

      <DialogContent className={styles.DialogContent}>
        <DialogHeader>
          <DialogTitle className={styles.DialogTitle}>Tìm kiếm</DialogTitle>
        </DialogHeader>
        <SearchBox />
      </DialogContent>

    </Dialog>
  );
};
