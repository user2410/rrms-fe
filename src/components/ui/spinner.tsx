import clsx from "clsx";

export default function Spinner({
  size = 8,
  color = 'green',
} : {
  size?: number;
  color?: 'red' | 'green' | 'yellow' | 'indigo' | 'purple' | 'pink' | 'gray';
}) {
  return (
    <div 
      className={clsx(
        "border-4 rounded-full animate-spin",
        `border-t-${color}-400`
      )} 
      style={{
        width: `${size > 0 ? size : 8}px`,
        height: `${size > 0 ? size : 8}px`,
      }}
    />
  );
}
