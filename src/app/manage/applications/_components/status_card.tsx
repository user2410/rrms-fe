import clsx from "clsx";

export default function StatusCard({
  title,
  value,
  className = "border-gray-400",
} : {
  title: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={clsx("border-l-4 pl-1 space-y-2", className)}>
      <div className="">{title}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
};
