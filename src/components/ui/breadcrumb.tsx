import clsx from "clsx";

export interface BreadCrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadCrumbProps {
  items: BreadCrumbItem[];
  primaryColor?: string;
  activeColor?: string;
  className?: string;
}

export default function BreadCrumb({ 
  items, 
  primaryColor = "text-gray-400", 
  activeColor = "text-white", 
  className 
} : BreadCrumbProps) {
  return (
    <div className={clsx("inline-flex items-center space-x-1 md:space-x-3", className)}>
      {items.map((item, idx) => (
        <span key={idx} className="inline-flex items-center">
          {idx > 0 ? (
            <svg className={clsx("w-3 h-3 mx-1", primaryColor)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
          ) : null}
          <a 
            href={item.href} 
            className={clsx(
              "ml-1 text-sm font-medium md:ml-2", 
              primaryColor, activeColor,
              (idx+1 === items.length) ? activeColor : primaryColor,
            )}>
            {item.icon ? (<span className="w-3 h-3 mr-2.5">{item.icon}</span>) : null}
            <span className="">{item.label}</span>
          </a>
        </span>
      ))}
    </div>
  );
}