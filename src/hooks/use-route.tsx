import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { FaCaretSquareUp, FaClipboardList, FaFileAlt, FaFileContract, FaFileInvoiceDollar, FaFingerprint, FaHandHolding, FaHome, FaMoneyCheckAlt, FaTools, FaUsers } from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";
import { BsBuildingFillAdd, BsBuildingFillCheck, BsFillBuildingsFill, BsFillFileTextFill, BsPersonFillGear } from "react-icons/bs";
import { FiLifeBuoy } from "react-icons/fi";

interface Route {
  label: string;
  href: string;
  icon?: React.ReactNode;
  subroutes?: Route[];
  active?: boolean;
}

const ICON_SIZE = 16;

const useRoutes = () => {
	const pathname = usePathname();

	const routes = useMemo<Route>(() => ({
    label: 'Home',
    href: '/',
    icon: <FaHome size={ICON_SIZE} />,
    subroutes: [
      {
        label: 'Dashboard',
        href: '/manage',
        icon: <AiFillDashboard size={ICON_SIZE} />,
        subroutes: [
          {
            label: 'Properties',
            href: '/manage/properties',
            icon: <BsFillBuildingsFill size={ICON_SIZE}/>,
            subroutes: [
              {
                label: 'My properties',
                href: '/manage/properties',
                icon: <BsBuildingFillCheck size={ICON_SIZE} />,
                active: pathname === '/manage/properties/my-properties',
              },
              {
                label: 'Create property',
                href: '/manage/properties/new',
                icon: <BsBuildingFillAdd size={ICON_SIZE}/>,
                active: pathname === '/manage/properties/new',
              },
              {
                label: 'Drafts',
                href: '/manage/properties/drafts',
                icon: <BsFillFileTextFill size={ICON_SIZE} />,
                active: pathname === '/manage/properties/drafts',
              },
            ]
          },
          {
            label: 'Rental',
            href: 'rental',
            icon: <FaHandHolding size={ICON_SIZE}/>,
            subroutes: [
              {
                label: 'Tenants',
                href: '/manage/rental/tenants',
                icon: <FaUsers size={ICON_SIZE}/>,
              },
              {
                label: 'Services',
                href: '/manage/rental/services',
                icon: <BsPersonFillGear size={ICON_SIZE} />,
              },
              {
                label: 'Leases',
                href: '/manage/rental/leases',
                icon: <FaFileContract size={ICON_SIZE} />,
              },
              {
                label: 'Payments',
                href: '/manage/rental/payments',
                icon: <FaMoneyCheckAlt size={ICON_SIZE} />,
              },
              {
                label: 'Invoices',
                href: '/manage/rental/invoices',
                icon: <FaFileInvoiceDollar size={ICON_SIZE} />,
              },
              {
                label: 'Maintenance',
                href: '/manage/rental/maintenance',
                icon: <FaTools size={ICON_SIZE} />,
              },
              {
                label: 'Reports',
                href: '/manage/reports',
                icon: <FaFileAlt size={ICON_SIZE} />,
              },
            ]
          },
          {
            label: 'Listings',
            href: '/manage/listings',
            icon: <FaCaretSquareUp size={ICON_SIZE}/>,
            subroutes: [
              {
                label: 'All listings',
                href: '/manage/listings',
                icon: <FaFingerprint size={ICON_SIZE}/>,
              },
              {
                label: 'Create new listings',
                href: '/manage/listings/new',
                icon: <FaClipboardList size={ICON_SIZE} />,
              },
              {
                label: 'Drafts',
                href: '/manage/listing/drafts',
                icon: <BsFillFileTextFill size={ICON_SIZE} />,
              },
            ]
          },
          {
            label: 'Feedback',
            href: '/manage/feedback',
            icon: <FiLifeBuoy size={ICON_SIZE}/>,
          }
        ],
      },
      {
        label: 'Landlord',
        href: '/landlord',
        active: pathname?.startsWith('/landlord'),
      },
      {
        label: 'Tenant',
        href: '/tenant',
        active: pathname?.startsWith('/tenant'),
      },
      {
        label: 'News',
        href: '/news',
        active: pathname?.startsWith('/news'),
      },
      {
        label: 'Contact',
        href: '/contact',
        active: pathname?.startsWith('/contact'),
      },
    ],
  }), [pathname]);

	return routes;
};

export default useRoutes;
