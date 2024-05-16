import { getPropertyTypeText, Property, propertyTypesToBgColor } from "@/models/property";
import { Badge } from "../ui/badge";

export const PropertyTypeBadge = ({ property }: { property: Property }) => {
  return (
    <Badge className={`text-white ${propertyTypesToBgColor[property.type as keyof typeof propertyTypesToBgColor]}`}>
      {getPropertyTypeText(property)}
    </Badge>
  );
};
