import ListingContent from "@/app/(main-app)/listings/[id]/_components/listing_content";
import { ListingFormValues } from "@/app/manage/listings/new/page";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UseFormReturn } from "react-hook-form";

export default function PreviewModal({
  form
}: {
  form: UseFormReturn<ListingFormValues, any, undefined>
}) {
  const property = form.watch("propertyData").property;
  const units = form.watch("propertyData").units;
  const selectedUnits = form.getValues("units");
  const listing = {
    ...form.watch("contact"),
    ...form.watch("listing"),
    ...form.watch("config"),
    id: "",
    creatorId: "",
    propertyId: property.id,
    price: selectedUnits.reduce((acc, unit) => acc + (unit.price || 0), 0) / selectedUnits.length,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiredAt: new Date(),
    units: units.map((unit) => ({listingId: "", unitId: unit.id, price: selectedUnits.find(su => su.unitId === unit.id)?.price || 0})),
  };
  
  return (
    <ScrollArea className="w-full md:w-[720px] lg:w-[920px] xl:w-[1000px] 2xl:w-[1200px] h-[80vh]">
      <ListingContent
        listing={listing as any}
        property={property}
        units={
          units
          .filter(u => selectedUnits.find(su => su.unitId === u.id))
          .map(u => ({...u, price: selectedUnits.find(su => su.unitId === u.id)?.price || 0}))}
        preview={true}
      />
    </ScrollArea>
  );
}
