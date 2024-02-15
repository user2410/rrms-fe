import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TableSkeleton() {
  return (
    <Table className="w-full bg-white">
      <TableHeader className="[&_tr]:border-b">
        <TableRow className="hover:bg-muted/50 data-[state=selected]:bg-muted">
          <TableHead>Tin đăng</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Thời gian đăng</TableHead>
          <TableHead>Hết hạn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr:last-child]:border-0">
        <TableRow className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
          <TableCell><Skeleton className="w-[40%] h-4"/></TableCell>
          <TableCell><Skeleton className="w-[20%] h-4"/></TableCell>
          <TableCell><Skeleton className="w-[20%] h-4"/></TableCell>
          <TableCell><Skeleton className="w-[20%] h-4"/></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ); 
};
