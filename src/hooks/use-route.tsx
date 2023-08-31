import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface Route {
  label: string;
  href: string;
  icon?: React.ReactNode;
  subroutes?: Route[];
}

const useRoutes = () => {
	const pathname = usePathname();

	const routes = useMemo<Route>(() => ({
    label: 'Home',
    href: '/',
    icon: <i className="fas fa-home" />,
    subroutes: [
      {
        label: 'Dashboard',
        href: '/manage',
        icon: <i className="fas fa-home" />,
        subroutes: [
          {
            label: 'Properties',
            href: '/manage/properties',
            icon: <i className="fas fa-building" />,
            subroutes: [
              {
                label: 'My properties',
                href: '/manage/properties/my-properties',
                icon: <i className="fas fa-building" />,
              },
              {
                label: 'Create property',
                href: '/manage/properties/new',
                icon: <i className="fas fa-plus" />,
              },
              {
                label: 'Drafts',
                href: '/manage/properties/drafts',
                icon: <i className="fas fa-file" />,
              },
            ]
          },
          {
            label: 'Rental management',
            href: 'rental',
            subroutes: [
              {
                label: 'Tenants',
                href: '/manage/rental/tenants',
                icon: <i className="fas fa-users" />,
              },
              {
                label: 'Services',
                href: '/manage/rental/services',
                icon: <i className="fas fa-user-gear" />,
              },
              {
                label: 'Leases',
                href: '/manage/rental/leases',
                icon: <i className="fas fa-file-contract" />,
              },
              {
                label: 'Payments',
                href: '/manage/rental/payments',
                icon: <i className="fas fa-money-check-alt" />,
              },
              {
                label: 'Invoices',
                href: '/manage/rental/invoices',
                icon: <i className="fas fa-file-invoice-dollar" />,
              },
              {
                label: 'Maintenance',
                href: '/manage/rental/maintenance',
                icon: <i className="fas fa-tools" />,
              },
              {
                label: 'Reports',
                href: '/manage/reports',
                icon: <i className="fas fa-file-alt" />,
              },
            ]
          },
          {
            label: 'Listings',
            href: '/manage/listings',
            subroutes: [
              {
                label: 'All listings',
                href: '/manage/listings',
                icon: <i className="fas fa-fingerprint" />,
              },
              {
                label: 'Create new listings',
                href: '/manage/listings/new',
                icon: <i className="fas fa-clipboard-list" />,
              },
              {
                label: 'Drafts',
                href: '/manage/listing/drafts',
                icon: <i className="fas fa-file" />,
              },
            ]
          },
        ],
      },
      {
        label: 'Search',
        href: '/search',
        icon: <i className="fas fa-search" />,
        subroutes: [],
      }
    ],
  }), [pathname]);

	return routes;
}

export default useRoutes;