import clsx from "clsx";

export default function Spinner({
  size = 8,
} : {
  size?: number;
}) {
  return (
    <div 
      className={clsx(
        "border-4 rounded-full animate-spin border-t-green-400"
      )} 
      style={{
        width: `${size > 0 ? size : 8}px`,
        height: `${size > 0 ? size : 8}px`,
      }}
    />
  );
}
