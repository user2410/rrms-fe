import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ManagedApplication } from "@/models/application";
import { FaCar, FaQuestionCircle } from "react-icons/fa";
import { GrBike } from "react-icons/gr";
import { RiMotorbikeFill } from "react-icons/ri";

export default function PersonalVehicles({
  data,
}: {
  data: ManagedApplication;
}) {
  return (
    <Card>
      <CardHeader className="!p-4 lg:!p-6 bg-gray-400">
        Phương tiện di chuyển
      </CardHeader>
      <CardContent className="!p-4 lg:!p-6">
        <div className="grid grid-cols-3 gap-4">
          {data.application.vehicles?.map((field, index) => (
            <div key={index} className="border flex flex-row justify-between py-2">
              <div className="space-y-2 px-4">
                {field.type === "car" ? (
                  <div className="flex flex-row items-center gap-2">
                    <FaCar size={16} />
                    <span className="text-lg font-semibold">Ô tô</span>
                  </div>
                ) : field.type === "motorbike" ? (
                  <div className="flex flex-row items-center gap-2">
                    <RiMotorbikeFill size={16} />
                    <span className="text-lg font-semibold">Xe máy</span>
                  </div>
                ) : field.type === "bicycle" ? (
                  <div className="flex flex-row items-center gap-2">
                    <GrBike size={16} />
                    <span className="text-lg font-semibold">Xe đạp</span>
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-2">
                    <FaQuestionCircle size={16} />
                    <span className="text-lg font-semibold">Khác</span>
                  </div>
                )}
                <div className="font-normal text-md">{field.model ? `${field.model} - ${field.code}` : field.code}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
