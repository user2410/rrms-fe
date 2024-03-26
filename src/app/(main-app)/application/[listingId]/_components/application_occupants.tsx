import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListingDetail } from "../page";
import BasicInfo from "./basic_info";
import CoApplicants from "./co-applicants";
import Minors from "./minors";
import MoveIn from "./move_in";
import Pets from "./pets";
import SelectedUnits from "./selected_units";
import { useFormContext } from "react-hook-form";
import { ApplicationForm } from "./main_form";

export default function ApplicationOccupants({
  data
} : {
  data: ListingDetail;
}) {
  const form = useFormContext<ApplicationForm>();

  return (
    <div className="space-y-4">
      <BasicInfo/>
      <Card>
        <MoveIn/>
        <Separator />
        <SelectedUnits data={data}/>
        {form.watch("ao.tenantType") === "INDIVIDUAL" && (
          <>
            <Separator />
            <CoApplicants listing={data.listing}/>
            <Separator />
            <Minors/>
            <Separator />
            <Pets listing={data.listing}/>
          </>
        )}
        {/* <Guarantors/>
        <Separator /> */}
      </Card>
    </div>
  );
}
