export default function StarRating({
  readOnly=true,
  disabled=true,
  value,
  size = "md",
  onChange,
} : {
  readOnly?: boolean;
  disabled?: boolean;
  value: number;
  size?: "sm" | "md" | "lg";
  onChange: (value: number) => void;
}) {
  return (
    <div className={`flex items-center ${size === "sm" ? "space-x-1" : size === "md" ? "space-x-2" : "space-x-3"} mb-5`}>
      {}
    </div>
  );
}
