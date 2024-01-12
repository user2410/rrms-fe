import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ManagedApplication, MapPetTypeToText } from "@/models/application";
import { FaWeight } from "react-icons/fa";

export default function BasicPets({
  data,
}: {
  data: ManagedApplication;
}) {
  return (
    <Card>
      <CardHeader className="!p-4 lg:!p-6 bg-gray-400">
        Thú nuôi
      </CardHeader>
      <CardContent className="!p-4 lg:!p-6">
        <div className="grid grid-cols-3 gap-2 w-full">
          {data.application.pets?.map((field, index) => (
            <div key={index} className="border py-2">
              <div className="space-y-2 px-4">
                <div className="text-lg font-semibold">{MapPetTypeToText[field.type as keyof typeof MapPetTypeToText]}</div>
                <div className="text-md font-normal flex flex-row items-center gap-2">
                  <FaWeight size={16} />
                  <span>{field.weight} kg</span>
                </div>
                <div className="text-sm font-light truncate">{field.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
