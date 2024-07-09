import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rental } from "@/models/rental";

export default function PoliciesCard({
  rental,
}: {
  rental: Rental;
}) {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Quy định thuê nhà</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rental.policies.length === 0 && (
            <div className="text-center">Chưa có quy định nào</div>
          )}
          {rental.policies.map((policy, index) => (
            <div className="border py-1 px-2" key={index}>
              <h2 className="text-lg font-semibold">{policy.title}</h2>
              <p className="text-md font-normal">{policy.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ghi chú</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{rental.note || "N/A"}</p>
        </CardContent>
      </Card>
    </div>
  );
};
