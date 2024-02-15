import { Fragment } from "react";
import { Data } from "../page";
import AddressForm from "./property/address_form";
import ExtraInfoForm from "./property/extra-info_form";
import GeneralInfoForm from "./property/general-info_form";
import MediaForm from "./property/prop-media_form";
import UnitsForm from "./property/units_form";

export default function Property({
  data,
}: {
  data: Data;
}) {
  const multiUnit = data.units.length > 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
      {multiUnit ? (
        <Fragment>
          <div className="space-y-6">
            <GeneralInfoForm
              initialData={{
                ...data.property,
                multiUnit: data.units.length > 1,
              }}
              propId={data.property.id}
            />
            <AddressForm
              initialData={{
                ...data.property,
              }}
              propId={data.property.id}
            />
            <MediaForm
              initialData={{media: data.property.media}}
              propId={data.property.id}
            />
            <ExtraInfoForm
              initialData={{
                ...data.property,
              }}
              propId={data.property.id}
            />
          </div>
          <div>
            <UnitsForm
              initialData={{
                unit: data.units,
              }}
              propId={data.property.id}
              propType={data.property.type}
            />
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <GeneralInfoForm
              initialData={{
                ...data.property,
                multiUnit: data.units.length > 1,
              }}
              propId={data.property.id}
            />
            <AddressForm
              initialData={{
                ...data.property,
              }}
              propId={data.property.id}
            />
            <MediaForm
              initialData={{media: data.property.media}}
              propId={data.property.id}
            />
            <ExtraInfoForm
              initialData={{
                ...data.property,
              }}
              propId={data.property.id}
            />
        </Fragment>
      )}
    </div>
  );
};
