import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

export default function Logo({
  logoOnly = false,
  className,
  imgClassName,
  titleClassName,
  href = '/',
  size = 80,
}: {
  logoOnly?: boolean;
  className?: string;
  imgClassName?: string;
  titleClassName?: string;
  href?: string;
  size?: number;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center focus:outline-none',
        className
      )}
    >
      <Image
        src="/logo.svg"
        alt="RRMS"
        width={size}
        height={size}
        className={clsx('dark:stroke-white' ,imgClassName)}
        priority
        loading="eager"
      />
      {!logoOnly &&
        <span className={clsx(
          "ml-2 xl:ml-3 self-center text-2xl font-semibold whitespace-nowrap dark:text-white",
          titleClassName && '',
        )}>RRMS</span>
      }
    </span>
  );
};
