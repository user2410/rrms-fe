import { getPrimaryImage } from "@/models/property";
import Image from "next/image";
import { useState } from "react";
import ApplicationItem from "./application_item";
import { PreviewApplication } from "./application_list";

const statusOrder = ["PENDING", "CONDITIONALLY_APPROVED", "APPROVED", "REJECTED"];

export default function ApplicationGroup({
  data,
} : {
  data: PreviewApplication[];
}) {
  const property = data[0].property;
  // sort applications, firstly in order of status (PENDING, CONDITIONALLY_APPROVED, APPROVED, REJECTED), then sort by createdAt
  const applications = data.sort((a, b) => { 
    const statusA = statusOrder.indexOf(a.application.status);
    const statusB = statusOrder.indexOf(b.application.status);
    if (statusA !== statusB) return statusA - statusB;
    return a.application.createdAt.getTime() - b.application.createdAt.getTime();   
  });

  const [show, setShow] = useState<number>(3);

  return (
    <div className="border">
      {/* Brief property info */}
      <div className="flex flex-row items-center justify-between gap-2 border p-2">
        <div className="flex flex-row items-center gap-2">
          <div className="relative w-[120px] aspect-video">
            <Image
              src={getPrimaryImage(property)}
              fill
              alt={property.name}
              objectFit="cover"
              objectPosition="center"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-medium">{property.name}</h3>
            <p className="text-sm font-light">{property.fullAddress}</p>
          </div>
        </div>
      </div>
      {/* Applications list*/}
      {applications.slice(0, show).map((a, i) => (
        <ApplicationItem ma={a} key={i} />
      ))}
      {applications.length > 3 && (
        <div 
          className="flex flex-row items-center justify-center border p-2 hover:bg-slate-100 cursor-pointer"
          onClick={() => setShow(v => (v >= applications.length ? 3 : applications.length))}
        >
          {show > 3 ? "Ẩn bớt" : "Hiện tất cả"}
      </div>
      )}
    </div>
  );
};

// {data.filter(a => {
//   const diff = intervalToDuration({
//     start: a.application.createdAt,
//     end: new Date()
//   });
//   return diff.days ? diff.days < 20 : false;
// }).map((a, i) => (
//   <ApplicationItem ma={a} key={i} />
// ))}
// {/* Applications older than 20 days */}
// {(() => {
//   const nApplications = g.applications.filter(a => {
//     const diff = intervalToDuration({
//       start: a.application.createdAt,
//       end: new Date()
//     });
//     return diff.days ? diff.days > 20 : false;
//   });
//   if (!nApplications.length) return null;
//   return (
//     <div className="flex flex-row items-center justify-between gap-2 border p-2">
//       <div className="flex flex-row items-center gap-2">
//         <div className="font-medium">
//           {nApplications.length} đơn ứng tuyển cũ hơn 20 ngày
//         </div>
//         <Separator orientation="vertical" />
//         <Button variant="link">Lưu trữ tất cả</Button>
//       </div>
//       <Button variant="ghost">Hiện tất cả</Button>
//     </div>
//   );
// })()}
