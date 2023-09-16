import { Control, UseFormReturn } from "react-hook-form";
import { Fragment } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Step2NRooms({
  control,
}: {
  control: Control<any>;
}) {
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
