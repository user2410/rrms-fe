import SearchBar from "./_components/landing-page/search-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container">
      <div className="
        relative
        bg-[url('/img/hanoi-banner.jpg')] bg-cover bg-center object-fill 
        h-auto py-24 px-10
        space-y-10
      ">
        <div className="absolute bg-gray-200 opacity-70" />
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>RRMS</CardTitle>
            <CardDescription>Discover Your New Rental</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchBar />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3>Bất động sản theo khu vực</h3>
        <div className="grid grid-cols-2 gap-4 lg:gap-6 xl:gap-7">
          
        </div>
      </div>
    </div>
  );
}
