import clsx from "clsx";
import Link from "next/link";

export default function BillTile() {
  return (
    <div className="relative w-full h-full">
      <div className="float-left text-xl font-bold">Rent Arrears</div>
      <Link
        href="/"
        className="float-right no-underline text-md font-semibold text-orange-400 hover:text-orange-500"
      >
        Bill collected
      </Link>
      <div className="clear-both"></div>
      <div className="mt-2 font-normal text-slate-500">
        from {8} properties this month
      </div>
      <div className="absolute bottom-0 left-0 w-full">
        <div className="mb-4">
          <span className="text-4xl font-extrabold mr-2">₫45,000,000</span>
          <span className="text-xl text-slate-400">/ ₫120,000,000</span>
        </div>
        <div className="flex items-center w-full">
          <span className="text-blue-400 text-md font-bold mr-2">45%</span>
          <div className="bg-gray-200 flex-1 h-2.5">
            <div className="bg-blue-400 w-2.5 h-2.5" style={{width: '45%'}}></div>
          </div>
        </div>
      </div>
    </div>
  )
}