import { PropertyForm } from "@/app/manage/properties/new/page";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Fragment } from "react";
import { useFormContext } from "react-hook-form";

export default function Step2NRooms({
  nth,
}: {
  nth?: number;
}) {
  const {control} = useFormContext<PropertyForm>();

  return (
    <Fragment>
      {[
        {
          fieldName: `units.${nth}.numberOfBedrooms`,
          label: "Phòng ngủ",
        },
        {
          fieldName: `units.${nth}.numberOfBathrooms`,
          label: "Phòng tắm",
        },
        {
          fieldName: `units.${nth}.numberOfBalconies`,
          label: "Ban công",
        },
        {
          fieldName: `units.${nth}.numberOfKitchens`,
          label: "Phòng bếp",
        },
        {
          fieldName: `units.${nth}.numberOfToilets`,
          label: "Toilet",
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
