import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import ApplicationList from "./application_list";
import { ApplicationUnit, TransformApplicationRESTResponse } from "@/models/application";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export type FetchedApplication = {
  id: number;
  listingId: string;
  propertyId: string;
  units: ApplicationUnit[];
  status: string;
  fullName: string;
  moveinDate: Date;
  preferredTerm: number;
  employmentStatus: string;
  employmentPosition?: string;
  employmentMonthlyIncome: number;
  createdAt: Date;
};

export default function ApplicationToMe() {
  const session = useSession();

  const query = useQuery<FetchedApplication[]>({
    queryKey: ["manage", "rentals", "applications", "to-me", session.data?.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get<FetchedApplication[]>("api/applications/to-me", {
        params: {
          fields: "listing_id,property_id,units,status,full_name,movein_date,preferred_term,employment_status,employment_position,employment_monthly_income,created_at"
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(4)!}`,
        },
      })).data;
    },
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  if (query.isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-red-500">Error: {JSON.stringify(query.error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ApplicationList
        applications={query.data!}
        listName="to-me"
      />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};


{/* <div className="my-4 w-full">
<TopSearchbar />
</div>
<div className="flex flex-row justify-between w-full">
<h2>Hiển thị {applications.length} đơn ứng tuyển ({nNewApplications} đơn mới cần xét duyệt)</h2>
<div className="flex flex-row items-center gap-2">
  <span className="text-sm font-light whitespace-nowrap">Sắp xếp</span>
  <Select defaultValue="newestToOldest">
    <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent gap-1">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="newestToOldest">Mới nhất đến muộn nhất</SelectItem>
        <SelectItem value="oldestToNewest">Muộn nhất đến mới nhất</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</div>
</div>
<div className="w-full space-y-4">
{/* Group application by property */}
// {groups && Object.values(groups).map((g, i) => (
//   <div key={i} className="border">
//     {/* Brief property info */}
//     <div className="flex flex-row items-center justify-between gap-2 border p-2">
//       <div className="flex flex-row items-center gap-2">
//         <div className="relative w-[120px] aspect-video">
//           <Image
//             src={g.property.media[0].url}
//             fill
//             alt={g.property.fullAddress}
//             objectFit="cover"
//             objectPosition="center"
//           />
//         </div>
//         <div className="flex flex-col">
//           <h3 className="text-lg font-medium">{g.property.name}</h3>
//           <p className="text-sm font-light">{g.property.fullAddress}</p>
//         </div>
//       </div>
//       <div className="flex flex-row gap-2">
//         <Button variant="link">Mời ứng tuyển</Button>
//         <Separator orientation="vertical" />
//         <div className="flex flex-row items-center gap-1">
//           <Label htmlFor="turnon_notification">Nhận đơn ứng tuyển</Label>
//           <Switch defaultChecked id="turnon_notification" />
//         </div>
//       </div>
//     </div>
//     {/* New applications within 20 days */}
//     {g.applications.filter(a => {
//       const diff = intervalToDuration({
//         start: a.application.createdAt,
//         end: new Date()
//       });
//       return diff.days ? diff.days < 20 : false;
//     }).map((a, i) => (
//       <ApplicationItem ma={a} key={i} />
//     ))}
//     {/* Applications older than 20 days */}
//     {(() => {
//       const nApplications = g.applications.filter(a => {
//         const diff = intervalToDuration({
//           start: a.application.createdAt,
//           end: new Date()
//         });
//         return diff.days ? diff.days > 20 : false;
//       });
//       if (!nApplications.length) return null;
//       return (
//         <div className="flex flex-row items-center justify-between gap-2 border p-2">
//           <div className="flex flex-row items-center gap-2">
//             <div className="font-medium">
//               {nApplications.length} đơn ứng tuyển cũ hơn 20 ngày
//             </div>
//             <Separator orientation="vertical" />
//             <Button variant="link">Lưu trữ tất cả</Button>
//           </div>
//           <Button variant="ghost">Hiện tất cả</Button>
//         </div>
//       );
//     })()}
//   </div>
// ))}
{/* {initialApplications.map((a, i) => (<ApplicationItem key={i} ma={a} />))} */ }

