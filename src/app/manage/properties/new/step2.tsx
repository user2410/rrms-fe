import { useFormContext } from "react-hook-form";
import Step2MultiRooms from "./_components/step2-block";
import Step2MultiApartments from "./_components/step2-multiapartments";
import Step2SingleUnit from "./_components/step2-sr";
import { PropertyForm } from "./page";


export default function Step2() {
  const form = useFormContext<PropertyForm>();
  const propertyType = form.watch("property.type");
  const multiUnit = form.watch("property.multiUnit");

  return (
    (["APARTMENT", "ROOM"].includes(propertyType) && !multiUnit) || propertyType === "PRIVATE" ? (() => {
      if(form.getValues("units").length === 0) {
        form.setValue("units", [{
          name: form.getValues("property.name"),
          floor: 0,
          area: form.getValues("property.area") as number,
          amenities: [],
          media: [],
          type: propertyType === "ROOM" ? "ROOM" : "APARTMENT"
        }]);
      }
      // single unit - OK
      return (<Step2SingleUnit />);
    }
    )() : propertyType === "ROOM" && multiUnit ? (
      // multi unit room - OK
      <Step2MultiRooms />
    ) : (propertyType === "APARTMENT" && multiUnit) || propertyType === "MINIAPARTMENT" ? (
      // multi unit apartment
      <Step2MultiApartments />
    ) : null
    // ) : propertyType === "OFFICE" | "STORE" ? (
    // TODO: attributes of office and store
    //   <Step2Office/>
  );
}
