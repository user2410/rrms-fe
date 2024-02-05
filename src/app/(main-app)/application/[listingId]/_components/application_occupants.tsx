import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BasicInfo from "./basic_info";
import CoApplicants from "./co-applicants";
import Minors from "./minors";
import MoveIn from "./move_in";
import Pets from "./pets";
import SelectedUnits from "./selected_units";
import { Unit } from "@/models/unit";
import { ListingDetail } from "../page";

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
        <CoApplicants/>
        <Separator />
        <Minors/>
        <Separator />
        {/* <Guarantors/>
        <Separator /> */}
        <Pets/>
      </Card>
    </div>
  );
}
