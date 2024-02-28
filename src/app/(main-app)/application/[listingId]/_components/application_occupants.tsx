import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListingDetail } from "../page";
import BasicInfo from "./basic_info";
import CoApplicants from "./co-applicants";
import Minors from "./minors";
import MoveIn from "./move_in";
import Pets from "./pets";
import SelectedUnits from "./selected_units";

export default function ApplicationOccupants({
  data
} : {
  data: ListingDetail;
}) {
  return (
    <div className="space-y-4">
      <BasicInfo/>
      <Card>
        <MoveIn/>
        <Separator />
        <SelectedUnits data={data}/>
        <Separator />
        <CoApplicants listing={data.listing}/>
        <Separator />
        <Minors/>
        <Separator />
        {/* <Guarantors/>
        <Separator /> */}
        <Pets listing={data.listing}/>
      </Card>
    </div>
  );
}
