import { pFeatures } from "@/models/property";
import { ListingDetail } from "../page";

export default function ListingDetails({
  listingDetail,
} : {
  listingDetail: ListingDetail
}) {
  return (
    <div>
      <h2 className="font-semibold text-xl mb-2">Đặc điểm bất động sản</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Tiện ích</h3>
          <div className="grid grid-cols-2 gap-2">
            {listingDetail.property.features.map((feature, index) => (
              <div key={index}>
                {(() => {
                  const feat = pFeatures.find(f => f.id === feature.featureId);
                  return (
                    <div className="flex gap-2">
                      <span className="w-4 h-4 mr-2">
                        <i className={feat!.icon} />
                      </span>
                      <div>{pFeatures.find(f => f.id === feature.featureId)!.text}</div>
                    </div>
                  );
                })()}
                <p className="font-light text-xs">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium">Phòng ốc</h3>
          <div className="grid grid-cols-3">
            <div className="flex"></div>
            <div className="flex"></div>
            <div className="flex"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
