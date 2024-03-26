import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PerfectPropertyManagement from "./_components/landing-page/perfect_property_management";
import RentalInplace from "./_components/landing-page/rental_inplace";
import SearchbarSuggestion from "./_components/landing-page/searchbar_suggestion";

export default function HomePage() {
  return (
    <div>
      <div className="
        bg-[url('/img/hanoi-banner.jpg')] bg-cover bg-center object-fill
        w-full h-[60vh]
        text-white
      ">
        <div className="w-full h-full bg-slate-900 bg-opacity-75 py-24 px-10 flex flex-col items-center justify-center gap-8">
          <div>
            <h1 className="w-full text-center text-6xl font-bold">Discover Your New Rental</h1>
            <h3 className="w-full text-center text-2xl">Helping 100 million renters find their perfect fit.</h3>
          </div>
          <form className="flex flex-row w-2/5 gap-1">
            <div className="flex-grow">
              <SearchbarSuggestion
                placeholder="Tìm kiếm theo khu vực"
                type="search"
                color="black"
              />
            </div>
            <Button className="">Tìm kiếm</Button>
          </form>
        </div>
      </div>
      
      <div className="container space-y-4">
        <RentalInplace />
        <Separator />
        <PerfectPropertyManagement />
      </div>
    </div>
  );
}
