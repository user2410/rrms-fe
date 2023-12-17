import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { addDays } from "date-fns";
import DarkCalendarStripe from "./date-stripe";

export default function PlanTile() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>My plan</CardTitle>
      </CardHeader>
      <CardContent>
        <DarkCalendarStripe
          dates={(() => {
            const today = new Date();
            return [
              { date: today, isHighlighted: true, hasEvent: true },
              { date: addDays(today, 1), hasEvent: true },
              { date: addDays(today, 2), hasEvent: true },
              { date: addDays(today, 3), hasEvent: false },
              { date: addDays(today, 4), hasEvent: false },
              { date: addDays(today, 5), hasEvent: false },
              { date: addDays(today, 6), hasEvent: false },
            ];
          })()}
        />
        <ScrollArea className="mt-6 flex flex-col space-y-4 max-h-[260px]">
          {[
            {
              time: "17:00",
              duration: "30 minutes",
              title: "Renew tenancy",
              description: "Checking Pham Chinh's tenancy",
            },
            {
              time: "9:00",
              duration: "1 hour",
              title: "Regular inspection",
              description: "Do a property inspection for 123 Nguyen Van Cu",
            },
            {
              time: "10:00",
              duration: "2 hour",
              title: "Check application",
              description: "Check application for 123 Nguyen Trai",
            },
            {
              time: "10:00",
              duration: "2 hour",
              title: "Check application",
              description: "Check application for 123 Nguyen Trai",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {item.title}{" "}({item.time} - {item.duration})
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
            // <div
            //   key={index}
            //   className="flex space-x-1 w-full min-h-[72px] border-2 border-transparent rounded-md hover:shadow-md overflow-x-hidden"
            // >
            //   <Link
            //     href="/manage/plan/1"
            //     className="flex space-x-2 no-underline w-[80%]"
            //   >
            //     <div className="p-2 w-[20%] border-l border-slate-300 ">
            //       <div className="text-xl font-semibold text-slate-600">
            //         {item.time}
            //       </div>
            //       <div className="text-lg font-light truncate text-slate-400">
            //         {item.duration}
            //       </div>
            //     </div>
            //     <div className="p-2 flex-1 overflow-hidden">
            //       <div className="text-xl font-semibold text-slate-600">
            //         {item.title}
            //       </div>
            //       <div className="text-lg font-normal text-slate-400 truncate">
            //         {item.description}
            //       </div>
            //     </div>
            //   </Link>
            //   <div className="flex justify-end items-center space-x-2 w-[20%] pr-2">
            //     <TooltipProvider>
            //       <Tooltip>
            //         <TooltipTrigger asChild>
            //           <button onClick={() => console.log("Mark as done")}>
            //             <IoMdCheckmarkCircleOutline size={25} className="text-green-500"/>
            //           </button>
            //         </TooltipTrigger>
            //         <TooltipContent>
            //           <p className="px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700">Mark as done</p>
            //         </TooltipContent>
            //       </Tooltip>
            //       <Tooltip>
            //         <TooltipTrigger asChild>
            //           <button onClick={() => console.log("Discard this task")}>
            //             <IoMdRemoveCircleOutline size={25} className="text-red-500" />
            //           </button>
            //         </TooltipTrigger>
            //         <TooltipContent>
            //           <p className="px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700">Discard this task</p>
            //         </TooltipContent>
            //       </Tooltip>
            //     </TooltipProvider>
            //   </div>
            // </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
