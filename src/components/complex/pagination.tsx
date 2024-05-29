import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationControl ({ 
  totalRecords, recordsPerPage, offset, onPageChange 
} : {
  totalRecords: number;
  recordsPerPage: number;
  offset: number;
  onPageChange: (offset: number) => void;
}) {
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const currentPage = Math.floor(offset / recordsPerPage) + 1;

  const getPaginationItems = () => {
    const paginationItems = [];
    const maxPagesToShow = 7; // Total number of page items to show including ellipsis
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(currentPage - halfMaxPagesToShow, 1);
    let endPage = Math.min(currentPage + halfMaxPagesToShow, totalPages);

    // Adjust if we're near the beginning or end of the range
    if (currentPage <= halfMaxPagesToShow) {
      endPage = Math.min(maxPagesToShow, totalPages);
    } else if (currentPage + halfMaxPagesToShow >= totalPages) {
      startPage = Math.max(totalPages - maxPagesToShow + 1, 1);
    }

    if (startPage > 1) {
      paginationItems.push(
        <PaginationItem key="start">
          <PaginationLink href="#" onClick={() => onPageChange(0)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        paginationItems.push(<PaginationEllipsis key="start-ellipsis" />);
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      paginationItems.push(
        <PaginationItem key={page}>
          <PaginationLink href="#" isActive={page === currentPage} onClick={() => onPageChange((page - 1) * recordsPerPage)}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationItems.push(<PaginationEllipsis key="end-ellipsis" />);
      }
      paginationItems.push(
        <PaginationItem key="end">
          <PaginationLink href="#" onClick={() => onPageChange((totalPages - 1) * recordsPerPage)}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return paginationItems;
  };

  return (totalRecords > 0) && (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={() => onPageChange(Math.max(offset - recordsPerPage, 0))} />
        </PaginationItem>
        {getPaginationItems()}
        <PaginationItem>
          <PaginationNext href="#" onClick={() => onPageChange(Math.min(offset + recordsPerPage, (totalPages - 1) * recordsPerPage))} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
