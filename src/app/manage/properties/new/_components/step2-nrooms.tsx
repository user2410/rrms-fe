import { PropertyForm } from "@/app/manage/properties/new/page";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Fragment } from "react";
import { useFormContext } from "react-hook-form";

export default function Step2NRooms() {
  const {control} = useFormContext<PropertyForm>();

  return (
    <Fragment>
      {[
        {
          fieldName: "units.0.numberOfLivingRooms",
          label: "Phòng khách",
        },
        {
          fieldName: "units.0.numberOfBedrooms",
          label: "Phòng ngủ",
        },
        {
          fieldName: "units.0.numberOfBathrooms",
          label: "Phòng tắm",
        },
        {
          fieldName: "units.0.numberOfKitchens",
          label: "Phòng bếp",
        },
        {
          fieldName: "units.0.numberOfToilets",
          label: "Toilet",
        },
        {
          fieldName: "units.0.numberOfBalconies",
          label: "Ban công",
        },
      ].map((item) => (
        <FormField
          key={item.fieldName}
          control={control}
          name={item.fieldName as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{item.label}</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
      ))}
    </Fragment>
  );
}
