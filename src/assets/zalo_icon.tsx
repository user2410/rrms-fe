import clsx from "clsx";
import Image from "next/image";

export default function ZaloIcon({className = "w-4 h-4"} : {className?: string}) {
  return (
    <div className={clsx("relative", className)}>
      <Image
        src="/img/zalo_icon.png"
        fill
        alt="Zalo icon"
        objectFit="cover"
        className="rounded-md"
      />
    </div>
  );
};
