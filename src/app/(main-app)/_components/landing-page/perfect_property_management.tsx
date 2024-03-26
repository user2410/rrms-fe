import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function PerfectPropertyManagement() {
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
