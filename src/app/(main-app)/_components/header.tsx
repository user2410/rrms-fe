import Logo from "@/components/ui/logo";
import AuthItem from "./auth-item";
import NavItems from "./nav-items";
import SearchModal from "./search.modal";
import Sidebar from "./sidebar";

export default function HeaderMain() {

  return (
    <nav className="fixed top-0 w-screen z-50 bg-background">
      <div className="container flex flex-wrap items-center justify-between mx-auto p-8">
        <div className="flex items-center space-x-4 md:space-x-8">
          <Logo size={40} />
        </div>

        <div className="hidden md:block">
          <NavItems />
        </div>

        {/* Right icons */}
        <div className="flex flex-row gap-2">
          {/* Hamburger menu - trigger nav items dropdown */}
          <div className="md:hidden">
            <Sidebar/>
          </div>
          <SearchModal/>
          <AuthItem />
        </div>
      </div>
    </nav>
  );
}
