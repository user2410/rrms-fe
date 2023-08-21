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
    <Link
      href={href}
      className={clsx(
        'inline-flex items-center focus:outline-none w-auto md:w-32 lg:w-72 justify-center',
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="RRMS"
        width={size}
        height={size}
        className={imgClassName}
        priority
        loading="eager"
      />
      {!logoOnly &&
        <span className={clsx(
          "ml-4 self-center text-2xl font-semibold whitespace-nowrap dark:text-white",
          titleClassName && '',
        )}>RRMS</span>
      }
    </Link>
  );
};
