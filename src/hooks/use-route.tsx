import { usePathname } from "next/navigation";
import { useMemo } from "react";

interface Route {
  label: string;
  href: string;
  icon?: React.ReactNode;
  subroutes?: Route[];
  active?: boolean;
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
                active: pathname === '/manage/properties/my-properties',
              },
              {
                label: 'Create property',
                href: '/manage/properties/new',
                icon: <i className="fas fa-plus" />,
                active: pathname === '/manage/properties/new',
              },
              {
                label: 'Drafts',
                href: '/manage/properties/drafts',
                icon: <i className="fas fa-file" />,
                active: pathname === '/manage/properties/drafts',
              },
            ]
          },
          {
            label: 'Rental',
            href: 'rental',
            icon: <i className="fa-solid fa-hand-holding-hand"/>,
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
            icon: <i className="fa-regular fa-square-caret-up"/>,
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
        label: 'Landlord',
        href: '/landlord',
        active: pathname.startsWith('/landlord'),
      },
      {
        label: 'Tenant',
        href: '/tenant',
        active: pathname.startsWith('/tenant'),
      },
      {
        label: 'News',
        href: '/news',
        active: pathname.startsWith('/news'),
      },
      {
        label: 'Contact',
        href: '/contact',
        active: pathname.startsWith('/contact'),
      },
    ],
  }), [pathname]);

	return routes;
}

export default useRoutes;