import { PropertyFormValues } from "./step1";
import Step2Apartment, { ApartmentUnitFormSchema } from "@components/page/manage/properties/new/step2-apartment";
import Step2Block, { BlockUnitFormSchema } from "@components/page/manage/properties/new/step2-block";
import Step2Room, { RoomUnitFormSchema } from "@components/page/manage/properties/new/step2-room";
import Step2SR, { SRUnitFormSchema } from "@components/page/manage/properties/new/step2-sr";

export type UnitFormValues = ApartmentUnitFormSchema | SRUnitFormSchema | RoomUnitFormSchema | BlockUnitFormSchema;

export default function Step2({
  property,
  onPrev,
  handleSubmit,
}: {
  property: Partial<PropertyFormValues>;
  onPrev: () => void;
  handleSubmit: (data: any) => void;
}) {
  function onSubmit(data: UnitFormValues) {  
    console.log(data);
    handleSubmit(data);
  }

  return (
    property.type === "APARTMENT" ? (
      <Step2Apartment
        initialValue={{
          units: [
            {
              building: "",
              project: "",
              amenities: [
                {
                  amenityId: "1",
                  description: "Bàn ghế gỗ, sofa da",
                }
              ],
            }
          ]
        }}
        onPrev={onPrev}
        handleSubmit={onSubmit}
      />
    ) : ['PRIVATE', 'TOWNHOUSE', 'SHOPHOUSE', 'VILLA'].includes(property.type!) ? (
      <Step2SR
        initialValue={{
          units: [
            {
              amenities: [
                {
                  amenityId: "1",
                  description: "Bàn ghế gỗ, sofa da",
                }
              ],
            }
          ]
        }}
        onPrev={onPrev}
        handleSubmit={onSubmit}
      />
    ) : ['ROOM', 'STUDIO', 'STORE'].includes(property.type!) ? (
      <Step2Room
        initialValue={{
          units: [
            {
              amenities: [
                {
                  amenityId: "1",
                  description: "Bàn ghế gỗ, sofa da",
                }
              ],
            }
          ]
        }}
        onPrev={onPrev}
        handleSubmit={onSubmit}
      />
    ) : property.type === "BLOCK" ? (
      <Step2Block
        initialValue={{
          units: [
            {
              name: "",
              amenities: [
                {
                  amenityId: "1",
                  description: "Bàn ghế gỗ, sofa da",
                }
              ],
              media: [],
            }
          ]
        }}
        onPrev={onPrev}
        handleSubmit={onSubmit}
      />
    ) : null
  );
}