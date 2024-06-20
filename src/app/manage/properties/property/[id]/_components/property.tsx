import { Fragment } from "react";
import AddressForm from "./property/address_form";
import ExtraInfoForm from "./property/extra-info_form";
import GeneralInfoForm from "./property/general-info_form";
import MediaForm from "./property/prop-media_form";
import UnitsForm from "./property/units_form";
import { usePropDataCtx } from "../_context/property_data.context";


export default function PropertyTab() {
  const { units } = usePropDataCtx();

  const multiUnit = units.length > 1;

  return (
    <>
      {multiUnit ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-6">
            <GeneralInfoForm />
            <AddressForm />
            <MediaForm />
          </div>
          <div className="space-y-6">
            <UnitsForm/>
            <ExtraInfoForm/>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <GeneralInfoForm />
          <MediaForm />
          <AddressForm />
          <ExtraInfoForm />
        </div>
      )}
    </>
  );
};
