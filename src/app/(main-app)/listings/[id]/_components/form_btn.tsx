import { Button, ButtonProps } from "@/components/ui/button";
import clsx from "clsx";

const FormBtn = ({
  variant = "default",
  className,
  icon,
  text,
}: {
  variant?: ButtonProps["variant"];
  className?: string;
  icon?: React.ReactNode;
  text: string;
}) => (
  <Button variant={variant} className={clsx(
    "flex justify-center items-center w-full gap-2",
    className
  )}>
    {icon}
    <span className="">{text}</span>
  </Button>
);
