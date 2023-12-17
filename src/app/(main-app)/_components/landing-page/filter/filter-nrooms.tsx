import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../search-bar";
import { Label } from "@/components/ui/label";

const nRoomsItems = [
  {
    value: "1",
    label: "1+",
  },
  {
    value: "2",
    label: "2+",
  },
  {
    value: "3",
    label: "3+",
  },
  {
    value: "4",
    label: "4+",
  },
  {
    value: "5",
    label: "5+",
  },
] as const;

export default function FilterNRooms() {
  const form = useFormContext<SearchFormValues>();

  return (
    <div className="space-y-2">
      <Label>Số phòng</Label>
      <div className="grid grid-cols-2 gap-1">
        {[
          {
            fieldName: "unumberOfLivingRooms",
            label: "Phòng khách",
          },
          {
            fieldName: "unumberOfBedrooms",
            label: "Phòng ngủ",
          },
          {
            fieldName: "unumberOfBathrooms",
            label: "Phòng tắm",
          },
          {
            fieldName: "unumberOfKitchens",
            label: "Phòng bếp",
          },
          {
            fieldName: "unumberOfToilets",
            label: "Toilet",
          },
          {
            fieldName: "unumberOfBalconies",
            label: "Ban công",
          },
        ].map((item) => (
          <FormField
           key={item.fieldName}
           control={form.control}
           name={item.fieldName as any}
           render={({field}) => (
            <FormItem>
              <FormLabel className="font-normal text-xs">{item.label}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger type="button">
                    <SelectValue placeholder={`Số ${item.label}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {nRoomsItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem> 
           )}>
          </FormField>
        ))}
      </div>
    </div>
  );
}
