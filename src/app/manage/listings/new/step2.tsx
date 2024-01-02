import { columns } from "./_components/columns";
import PropertyTable from "./_components/property-table";
import { mockupProperties } from "@/models/property";
import wait from "@/utils/wait-fn";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { ListingFormValues } from "./page";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function Step2() {
  const form = useFormContext<ListingFormValues>();
  const propertiesQuery = useQuery({
    queryKey: ["my-properties"],
    queryFn: () => wait(1000).then(() => [...mockupProperties]),
  });

  if (propertiesQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (propertiesQuery.isError) {
    return <div>Error: <pre>{JSON.stringify(propertiesQuery.error)}</pre></div>;
  }

  return (
    <div>
      <FormField
        control={form.control}
        name="propertyID"
        render={() => (
          <FormItem>
            <FormLabel>Chọn bất động sản</FormLabel>
            <FormControl>
              <PropertyTable columns={columns} data={propertiesQuery.data} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
    </div>
  );
}
