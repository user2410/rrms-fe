import { MapPetTypeToText } from "@/models/application";
import { RentalPet } from "@/models/rental";
import { FaWeight } from "react-icons/fa";

export default function TenantPet({pet} : {pet: RentalPet}) {
  return (
    <div className="border py-2">
      <div className="space-y-2 px-4">
        <div className="text-lg font-semibold">{MapPetTypeToText[pet.type as keyof typeof MapPetTypeToText]}</div>
        <div className="text-md font-normal flex flex-row items-center gap-2">
          <FaWeight size={16} />
          <span>{pet.weight} kg</span>
        </div>
        <div className="text-sm font-light truncate">{pet.description}</div>
      </div>
    </div>
  );
};
