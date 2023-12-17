import { ListingFormValues } from "@/app/manage/listings/new/page";
import { UseFormReturn, useFormContext } from "react-hook-form";

export default function PreviewModal({
  form
}: {
  form: UseFormReturn<ListingFormValues, any, undefined>
}) {
  return (
    <div className="w-full md:w-[720px] lg:w-[920px] xl:w-[1000px] 2xl:w-[1200px] relative">
      {form.getValues("propertyID")}
    </div>
  );
}
