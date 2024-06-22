import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Rental } from "@/models/rental";

export default function PoliciesCard({
  rental,
} : {
  rental: Rental;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Quy định khi thuê nhà</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {rental.policies.map((policy, index) => (
          <div className="space-y-2" key={index}>
            <h3 className="text-lg font-semibold">{index+1}. {policy.title}</h3>
            <p className="text-base font-normal">{policy.content}</p>
          </div>
        ))}
      </CardContent>
      <Separator/>
      <CardHeader>
        <CardTitle className="text-xl">Ghi chú của chủ nhà</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base font-normal">{rental.note}</p>
      </CardContent>
    </Card>
  );
};
