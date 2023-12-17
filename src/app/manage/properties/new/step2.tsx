import Step2Apartment from "./_components/step2-apartment";
import Step2Block from "./_components/step2-block";
import Step2Room from "./_components/step2-room";
import Step2SR from "./_components/step2-sr";
import { useFormContext } from "react-hook-form";
import { PropertyForm } from "./page";


export default function Step2() {
  const form = useFormContext<PropertyForm>();
  const propertyType = form.getValues('property.type');

  return (
    propertyType === "APARTMENT" ? (
      <Step2Apartment/>
    ) : ['PRIVATE', 'TOWNHOUSE', 'SHOPHOUSE', 'VILLA'].includes(propertyType!) ? (
      <Step2SR/>
    ) : ['ROOM', 'STUDIO', 'STORE'].includes(propertyType!) ? (
      <Step2Room/>
    // ) : propertyType === "OFFICE" ? (
    //   <Step2Office/>
    ) : propertyType === "BLOCK" ? (
      <Step2Block/>
    ) : null
  );
}
