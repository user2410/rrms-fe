
import Header from "./_components/header";
import Sidebar from "./_components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto py-10">
      <div className="my-4">
        <Header/>
      </div>
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-3">
          <div className="sticky top-28">
            <Sidebar />
          </div>
        </div>
        <div className="col-span-7">
          {children}
        </div>
      </div>
    </div>
  );
};
