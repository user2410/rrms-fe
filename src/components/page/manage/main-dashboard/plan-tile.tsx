import { addDays } from "date-fns";
import DarkCalendarStripe from "./date-stripe";
import Link from "next/link";
import { Tooltip } from "flowbite-react";
import { IoMdCheckmarkCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";

export default function PlanTile() {
  return (
    <>
      <div className="text-xl font-bold">My plan</div>
      <div className="mt-4">
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
      </div>
      <div className="mt-6 flex flex-col space-y-4 max-h-[260px] overflow-y-auto scrollbar">
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
            className="flex space-x-1 w-full min-h-[72px] border-2 border-transparent rounded-md hover:shadow-md overflow-x-hidden"
          >
            <Link
              href="/manage/plan/1"
              className="flex space-x-2 no-underline w-[80%]"
            >
              <div className="p-2 w-[20%] border-l border-slate-300 ">
                <div className="text-xl font-semibold text-slate-600">
                  {item.time}
                </div>
                <div className="text-lg font-light truncate text-slate-400">
                  {item.duration}
                </div>
              </div>
              <div className="p-2 flex-1 overflow-hidden">
                <div className="text-xl font-semibold text-slate-600">
                  {item.title}
                </div>
                <div className="text-lg font-normal text-slate-400 truncate">
                  {item.description}
                </div>
              </div>
            </Link>
            <div className="flex justify-end items-center space-x-2 w-[20%] pr-2">
              <Tooltip content="Mark as done">
                <button onClick={() => console.log("Mark as done")}>
                  <IoMdCheckmarkCircleOutline
                    size={25}
                    className="text-green-500"
                  />
                </button>
              </Tooltip>
              <Tooltip content="Discard this task">
                <button onClick={() => console.log("Discard")}>
                  <IoMdRemoveCircleOutline size={25} className="text-red-500" />
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
