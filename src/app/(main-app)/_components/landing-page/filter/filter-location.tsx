import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DivisionSelector from "@/components/complex/division-selector";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../search-bar";

export default function LocationFilter() {
  const form = useFormContext<SearchFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Khu vực</CardTitle>
        <CardDescription>Chọn khu vực bạn muốn tìm kiếm.</CardDescription>
      </CardHeader>
      <CardContent className="">
        <DivisionSelector
          cityFieldName="city"
          districtFieldName="district"
          wardFieldName="ward"
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="button" variant="outline" onClick={() => {
          form.resetField("pcity");
          form.resetField("pdistrict");
          form.resetField("pward");
        }}>
          Đặt lại
        </Button>
      </CardFooter>
    </Card>
  );
}
