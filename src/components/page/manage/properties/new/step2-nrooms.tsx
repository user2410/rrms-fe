import { PropertyForm } from "@/app/manage/properties/new/page";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Fragment } from "react";
import { useFormContext } from "react-hook-form";

export default function Step2NRooms() {
  const {control} = useFormContext<PropertyForm>();

  return (
    <Fragment>
      <FormField
        control={control}
        name="units.0.numberOfLivingRooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phòng khách</FormLabel>
            <FormControl>
              <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="units.0.numberOfBedrooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phòng ngủ</FormLabel>
            <FormControl>
              <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="units.0.numberOfBathrooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phòng tắm</FormLabel>
            <FormControl>
              <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="units.0.numberOfKitchens"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phòng bếp</FormLabel>
            <FormControl>
              <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="units.0.numberOfToilets"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Toilet</FormLabel>
            <FormControl>
              <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="units.0.numberOfBalconies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ban công</FormLabel>
            <FormControl>
              <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
    </Fragment>
  )
}
