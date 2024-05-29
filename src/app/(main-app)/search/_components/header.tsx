import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mapPropertyTypeToText, pFeatures } from "@/models/property";
import { uAmenities } from "@/models/unit";
import { GetCityById, GetDistrictById, GetLocationName, GetWardById } from "@/utils/dghcvn";
import { SearchFormValues } from "../../_components/search_box";
import { getSearchURL } from "./get_searchurl";

function getHeaderText(data: SearchFormValues) {
  let header = "Tìm kiếm nhà cho thuê ưng ý";

  if (data.ptypes && data.ptypes.length > 0) {
    header = "Cho thuê " + data.ptypes.map(pt => (mapPropertyTypeToText[pt.toUpperCase() as keyof typeof mapPropertyTypeToText].toLowerCase())).join(", ");
  }

  if (data.pcity || data.pdistrict || data.pward) {
    header += ` tại ${GetLocationName(
      data.pcity || "",
      data.pdistrict || "",
      data.pward || "")}`;
  }

  if (data.unumberOfBedrooms) {
    header += ` ${data.unumberOfBedrooms} phòng ngủ`;
  }

  if (data.unumberOfBathrooms) {
    header += ` ${data.unumberOfBathrooms} phòng tắm`;
  }

  if (data.unumberOfKitchens) {
    header += ` ${data.unumberOfKitchens} bếp`;
  }

  if (data.unumberOfToilets) {
    header += ` ${data.unumberOfToilets} nhà vệ sinh`;
  }

  if (data.unumberOfBalconies) {
    header += ` ${data.unumberOfBalconies} ban công`;
  }

  if (data.porientation) {
    header += ` hướng ${data.porientation}`;
  }

  return header.trim().replace(/\s+/g, ' ');
}

export default function Header({ query }: { query: SearchFormValues }) {
  return (
    <div className="py-4 space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          {(query.ptypes && query.ptypes.length > 0) && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {query.ptypes.length > 1 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      Cho thuê nhà
                      <span className="sr-only">Cho thuê nhà</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {query.ptypes.map((ptype, index) => (
                        <DropdownMenuItem key={index}>{mapPropertyTypeToText[ptype.toUpperCase() as keyof typeof mapPropertyTypeToText].toLowerCase()}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <BreadcrumbLink href={getSearchURL({ ptypes: [query.ptypes[0]] })}>
                    Cho thuê {mapPropertyTypeToText[query.ptypes[0].toUpperCase() as keyof typeof mapPropertyTypeToText].toLowerCase()}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          )}
          {query.pcity && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={getSearchURL({ pcity: query.pcity })}>
                  Cho thuê nhà&nbsp;{GetCityById(query.pcity)?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          {query.pdistrict && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={getSearchURL({ pcity: query.pcity, pdistrict: query.pdistrict })}>
                  Cho thuê nhà&nbsp;{GetDistrictById(query.pdistrict)?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          {query.pward && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={getSearchURL({ pcity: query.pcity, pdistrict: query.pdistrict, pward: query.pward })}>
                  Cho thuê nhà&nbsp;{GetWardById(query.pward)?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          {[
            query.unumberOfBedrooms,
            query.unumberOfBathrooms,
            query.unumberOfBalconies,
            query.unumberOfToilets,
            query.unumberOfLivingRooms,
            query.unumberOfKitchens,
            query.porientation,
            query.pfeatures,
            query.uamenities,
            query.pminArea,
            query.pmaxArea,
            query.lminPrice,
            query.lmaxPrice,
          ].some((x) => !!x) && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      Tiêu chí khác
                      <span className="sr-only">Tiêu chí khác</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {[
                        query.pminArea,
                        query.pmaxArea,
                        query.lminPrice,
                        query.lmaxPrice,
                      ].filter(x => !!x).length > 0 && (
                          <>
                            <DropdownMenuGroup>
                              {(query.pminArea || query.pmaxArea) && (
                                <DropdownMenuItem>
                                  Diện tích{query.pminArea ? ` từ ${query.pminArea} m²` : ""}{query.pmaxArea ? ` đến ${query.pmaxArea} m²` : ""}
                                </DropdownMenuItem>
                              )}
                              {(query.lminPrice || query.lmaxPrice) && (
                                <DropdownMenuItem>
                                  Giá{query.lminPrice ? ` từ ${query.lminPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}` : ""}{query.lmaxPrice ? ` đến ${query.lmaxPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}` : ""}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuGroup>
                          </>
                        )}
                      {[
                        query.unumberOfBedrooms,
                        query.unumberOfBathrooms,
                        query.unumberOfBalconies,
                        query.unumberOfToilets,
                        query.unumberOfLivingRooms,
                        query.unumberOfKitchens,
                      ].filter(x => !!x).length > 0 && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                              {!!query.unumberOfBedrooms && (
                                <DropdownMenuItem>{query.unumberOfBedrooms} phòng ngủ</DropdownMenuItem>
                              )}
                              {!!query.unumberOfBathrooms && (
                                <DropdownMenuItem>{query.unumberOfBathrooms} phòng tắm</DropdownMenuItem>
                              )}
                              {!!query.unumberOfBalconies && (
                                <DropdownMenuItem>{query.unumberOfBalconies} ban công</DropdownMenuItem>
                              )}
                              {!!query.unumberOfToilets && (
                                <DropdownMenuItem>{query.unumberOfToilets} toilet</DropdownMenuItem>
                              )}
                              {!!query.unumberOfLivingRooms && (
                                <DropdownMenuItem>{query.unumberOfLivingRooms} phòng khách</DropdownMenuItem>
                              )}
                              {!!query.unumberOfKitchens && (
                                <DropdownMenuItem>{query.unumberOfKitchens} bếp</DropdownMenuItem>
                              )}
                            </DropdownMenuGroup>
                          </>
                        )}
                      {query.porientation && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem>hướng {query.porientation}</DropdownMenuItem>
                          </DropdownMenuGroup>
                        </>
                      )}
                      {query.pfeatures.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {query.pfeatures.map((feature, index) => (
                              <DropdownMenuItem key={index}>{pFeatures.find(pf => pf.id.toString() === feature.toString())?.text}</DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </>
                      )}
                      {query.uamenities.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {query.uamenities.map((amenity, index) => (
                              <DropdownMenuItem key={index}>{uAmenities.find(ua => ua.id.toString() === amenity.toString())?.text}</DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
              </>
            )}
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="font-semibold text-2xl">{getHeaderText(query)}</h1>
    </div>
  );
};
