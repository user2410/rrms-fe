import ListingContent from "@/app/(main-app)/listings/[id]/_components/listing_content";
import { ListingFormValues } from "@/app/manage/listings/new/page";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UseFormReturn } from "react-hook-form";

export default function PreviewModal({
  form
}: {
  form: UseFormReturn<ListingFormValues, any, undefined>
}) {
  const property = form.getValues("propertyData").property;
  const units = form.getValues("propertyData").units;
  const listing = {
    id: "",
    creatorId: "",
    propertyId: property.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiredAt: new Date(),
    units: units.map((unit) => ({listingId: "", unitId: unit.id, price: 0})),
    ...form.getValues("contact"),
    ...form.getValues("listing"),
    ...form.getValues("config"),
  };
  
  return (
    <ScrollArea className="w-full md:w-[720px] lg:w-[920px] xl:w-[1000px] 2xl:w-[1200px] h-[80vh]">
      <ListingContent
        listing={listing as any}
        property={property}
        units={units}
        preview={true}
      />
    </ScrollArea>
  );
}
