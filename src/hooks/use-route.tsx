import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BsBuildingFillAdd, BsFillBuildingsFill, BsPersonFillGear } from "react-icons/bs";
import { FaFileAlt, FaFileContract, FaFileInvoiceDollar, FaHandHolding, FaHome, FaMoneyBill, FaMoneyCheckAlt, FaTools, FaUser, FaUsers } from "react-icons/fa";
import { FiLifeBuoy, FiUser } from "react-icons/fi";

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
        icon: <FaHome size={ICON_SIZE*1.5} />,
        subroutes: [
          {
            label: 'Nhà cho thuê',
            href: '/manage/properties',
            icon: <BsFillBuildingsFill size={ICON_SIZE}/>,
            subroutes: [
              {
                label: 'Tin đăng',
                href: '/manage/listings',
                icon: <BsBuildingFillAdd size={ICON_SIZE}/>,
                active: pathname?.startsWith('/manage/properties'),
              },
            ]
          },
          {
            label: 'Quản lý thuê',
            href: 'rental',
            icon: <FaHandHolding size={ICON_SIZE}/>,
            subroutes: [
              {
                label: 'Đơn ứng tuyển',
                href: '/manage/rental/applications',
                icon: <FaUsers size={ICON_SIZE}/>,
              },
              {
                label: 'Dịch vụ',
                href: '/manage/rental/services',
                icon: <BsPersonFillGear size={ICON_SIZE} />,
              },
              {
                label: 'Hợp đồng thuê',
                href: '/manage/rental/leases',
                icon: <FaFileContract size={ICON_SIZE} />,
              },
              {
                label: 'Bảo trì',
                href: '/manage/rental/maintenance',
                icon: <FaTools size={ICON_SIZE} />,
              },
              {
                label: 'Báo cáo',
                href: '/manage/reports',
                icon: <FaFileAlt size={ICON_SIZE} />,
              },
            ]
          },
          {
            label: 'Tài khoản',
            href: '/manage/my-account',
            icon: <FaUser size={ICON_SIZE}/>,
            subroutes: [
              {
                label: 'Tài khoản của tôi',
                href: '/manage/my-account',
                icon: <FiUser size={ICON_SIZE} />,
              },
              {
                label: 'Lịch sử thanh toán',
                href: '/manage/my-account/billing-history',
                icon: <FaMoneyBill size={ICON_SIZE} />,
              },
            ],
          },
          {
            label: 'Feedback',
            href: '/manage/feedback',
            icon: <FiLifeBuoy size={ICON_SIZE}/>,
          },
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
