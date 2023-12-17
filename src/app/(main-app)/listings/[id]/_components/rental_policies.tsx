import { ListingPolicy, rentalPolicies } from "@/models/listing";
import { Fragment } from "react";

export default function RentalPolicies({policies} : {policies: ListingPolicy[]}) {
  return (
    <div>
      <h2 className="font-semibold text-xl mb-2">Quy định cho thuê</h2>
      <div className="grid grid-cols-2">
        {policies.map((policy, index) => (
          <div key={index}>
            {(() => {
              const pol = rentalPolicies.find(p => p.id === policy.policyId);
              return (
                <Fragment>
                  <div className="flex gap-2">
                    <span className="w-4 h-4 mr-2">
                      <i className={pol!.icon} />
                    </span>
                    <div>{pol!.text}</div>
                  </div>
                  <p className="font-light text-xs">{policy.note}</p>
                </Fragment>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}
