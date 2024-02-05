import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RentalInplace from "./_components/landing-page/rental_inplace";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

function PerfectPropertyManagement() {
  return (
    <div className="w-full h-full py-6 flex flex-col items-center gap-6">
      <h2 className="text-4xl font-semibold">The Perfect Place to Manage Your Property</h2>
      <h3 className="text-2xl">Work with the best suite of property management tools on the market.</h3>
      <div className="grid grid-cols-2">
        <div className="flex flex-col justify-center bg-gray-200">
          <h2 className="px-4 font-semibold">Advertise Your Rental</h2>
          <p className="px-4">Reach millions of renters and fill your vacancies faster with our digital marketing solutions.</p>
          <div><Button variant="link" className="">List your property</Button></div>
        </div>
        <div className="relative aspect-video">
          <Image src="/img/apartment_placeholder.jpg" alt="advertise your rental" fill objectFit="cover"/>
        </div>
        <div className="relative aspect-video">
          <Image src="/img/hanoi-banner.jpg" alt="advertise your rental" fill objectFit="cover"/>
        </div>
        <div className="flex flex-col justify-center bg-gray-200">
          <h2 className="px-4 font-semibold">Lease 100% Online</h2>
          <p className="px-4">Accept applications, process rent payments online, and sign digital leases all powered on a single platform.</p>
          <div><Button variant="link" className="">Manage your property</Button></div>
        </div>
      </div>
    </div>
  );
}
export default function Home() {
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
          <div className="flex flex-row w-2/5">
            <Input placeholder="Search by Location"/>
            <Button className="">Search</Button>
          </div>
        </div>
        {/* <Card className="w-full md:w-3/5 border-none">
          <CardHeader>
            <CardTitle>RRMS</CardTitle>
            <CardDescription>Discover Your New Rental</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchBox />
          </CardContent>
        </Card> */}
      </div>
      
      <div className="container space-y-4">
        <RentalInplace />
        <Separator />
        <PerfectPropertyManagement />
      </div>
    </div>
  );
}
