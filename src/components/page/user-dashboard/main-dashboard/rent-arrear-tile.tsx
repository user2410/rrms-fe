import clsx from "clsx";
import Link from "next/link";

export default function RentArrearTile() {
  const statArrow = "up";
  const statPercent = "3.48";
  const statDescripiron = "Since last month";

  return (
    <div className="relative w-full h-full">
      <div className="float-left text-xl font-bold">Rent Arrears</div>
      <Link
        href="/"
        className="float-right no-underline text-md font-semibold text-orange-400 hover:text-orange-500"
      >
        View all
      </Link>
      <div className="clear-both"></div>
      <div className="mt-2 font-normal text-slate-500">
        from {12} properties
      </div>
      <div className="absolute bottom-0 left-0">
        <div className="mb-4 text-4xl font-extrabold">₫43,500,000</div>
        <p className="text-sm text-blueGray-400 mt-4">
          <span
            className={clsx(
              "mr-2",
              statArrow === "up" ? "text-emerald-500" : "text-red-500",
            )}
          >
            <i
              className={
                statArrow === "up"
                  ? "fas fa-arrow-up"
                  : statArrow === "down"
                  ? "fas fa-arrow-down"
                  : ""
              }
            ></i>{" "}
            {statPercent}%
          </span>
          <span className="whitespace-nowrap">{statDescripiron}</span>
        </p>
      </div>
    </div>
  );
}
