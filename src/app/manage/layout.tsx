// import ManageHeaderStats from "@components/page/user-dashboard/header";
import ManageDashboardNavbar from "@/components/page/manage/navbar";
import Sidebar from "@/components/page/manage/sidebar";

export default function ManageLayout({ 
  children
} : {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <ManageDashboardNavbar />
        {children}
        {/* Header */}
        {/* <ManageHeaderStats /> */}
        {/* <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <ManageFooterAdmin />
        </div> */}
      </div>
    </div>
  );
}
