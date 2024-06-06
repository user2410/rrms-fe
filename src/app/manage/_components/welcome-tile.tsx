"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { getUserFullName, User } from "@/models/user";
import { useQuery } from "@tanstack/react-query";
import { Chart as ChartJS, registerables } from "chart.js";
import { Session } from "next-auth";
import Link from "next/link";
import { Chart } from "react-chartjs-2";

ChartJS.register(...registerables);

type ExtremeRentalProperty = {
  propertyId: string;
  count: number;
};

type ExtremeRentalUnit = {
  propertyId: string;
  unitId: string;
  count: number;
};

type Data = {
  properties: string[];
  ownedProperties: string[];
  occupiedProperties: string[];
  propertiesHavingListings: string[];
  units: string[];
  occupiedUnits: string[];
  propertiesWithActiveListing: string[];
  mostRentedProperties: ExtremeRentalProperty[];
  leastRentedProperties: ExtremeRentalProperty[];
  mostRentedUnits: ExtremeRentalUnit[];
  leastRentedUnits: ExtremeRentalUnit[];
};

export default function WelcomeTile({
  sessionData,
}: {
  sessionData: Session;
}) {
  const query = useQuery<Data>({
    queryKey: ["manage", "statistic", "properties", sessionData!.user.accessToken],
    queryFn: async ({queryKey}) => {
      return (await backendAPI.get<Data>("/api/statistics/manager/properties", {
        params: {
          limit: 2,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const detailsQuery = useQuery<{
    properties: Property[]
    units: Unit[];
  }>({
    queryKey: ["manage", "statistic", "properties", "details", sessionData!.user.accessToken],
    queryFn: async ({queryKey}) => {
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          propIds: query.data!.properties,
          fields: "name,full_address,city,district,ward",
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data;
      const units = (await backendAPI.get<Unit[]>("/api/units/ids", {
        params: {
          unitIds: query.data!.units,
          fields: "name,property_id",
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data;
      return {
        properties,
        units,
      };
    },
    enabled: query.isSuccess,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <Card className="w-full h-full ">
      <CardHeader>
        <CardTitle>Chào mừng, {getUserFullName(sessionData.user.user as any)}</CardTitle>
        <CardDescription>
          Thông tin về nhà cho thuê của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        {query.isError ? (
          <div className="text-red-500">Lỗi khi tải dữ liệu</div>
        ) : (
          <div className="my-8 flex flex-row items-center gap-6">
            <div className="flex-grow flex flex-col items-center gap-8">
              <div className="w-36 h-36 flex flex-col justify-center items-center gap-4">
                {query.isLoading ? (
                  <Spinner size={32} />
                ) : (
                  <>
                    <Chart
                      type="doughnut"
                      options={{
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                      data={{
                        labels: ["Phòng/căn hộ còn trống", "Phòng/căn hộ đang cho thuê"],
                        datasets: [
                          {
                            data: [query.data.occupiedUnits.length, query.data.units.length - query.data.occupiedUnits.length],
                            backgroundColor: [
                              "rgb(249 128 128)",
                              "rgb(118 169 250)",
                            ],
                            hoverOffset: 4,
                          },
                        ],
                      }}
                    />
                    <p className="text-sm font-light">Tỉ lệ lấp đầy: {(query.data.occupiedUnits.length / query.data.units.length * 100).toFixed(2)}%</p>
                  </>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-md font-md">Tổng số nhà cho thuê</div>
                <div className="flex flex-row items-end gap-2">
                  <span className="text-3xl font-extrabold">{query.isLoading ? (<Spinner size={16} />) : query.isError ? "Đã có lỗi xảy ra" : (query.data.properties.length)}</span>
                  <span className="text-base font-normal">(Sở hữu {query.isLoading ? (<Spinner size={16} />) : query.isError ? "Đã có lỗi xảy ra" : (query.data.ownedProperties.length)} nhà)</span>
                </div>
              </div>
              <div className="space-y-3">
                <Link href={``} className="flex flex-row gap-2">
                  <span className="w-1 h-6 inline-block bg-red-400"></span>
                  <span className="font-bold">{query.isLoading ? (<Spinner size={16} />) : query.isError ? "Đã có lỗi xảy ra" : (query.data.occupiedProperties.length)}</span>
                  <span className="text-md font-md">đang cho thuê</span>
                </Link>
                <Link href={``} className="flex flex-row gap-2">
                  <span className="w-1 h-6 inline-block bg-blue-400"></span>
                  <span className="font-bold">{query.isLoading ? (<Spinner size={16} />) : query.isError ? "Đã có lỗi xảy ra" : (query.data.properties.length - query.data.occupiedProperties.length)}</span>
                  <span className="text-md font-md">còn trống</span>
                </Link>
                <Link href={``} className="flex flex-row gap-2">
                  <span className="w-1 h-6" />
                  <span className="font-bold">{query.isLoading ? (<Spinner size={16} />) : query.isError ? "Đã có lỗi xảy ra" : (query.data.propertiesWithActiveListing.length)}</span>
                  <span className="text-md font-md">đang đăng tin</span>
                </Link>
              </div>
            </div>
            <div className="flex-grow flex flex-col items-center gap-4">
              <h3 className="text-xl font-medium">Xếp hạng lượt cho thuê</h3>
              <Tabs defaultValue="properties" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="properties">Nhà cho thuê</TabsTrigger>
                  <TabsTrigger value="units">Phòng/Căn hộ</TabsTrigger>
                </TabsList>
                <TabsContent value="properties">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Nhà cho thuê</TableHead>
                        <TableHead>Lượt thuê</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {query.isLoading ? (<Spinner size={16} />) : query.isError ? "Đã có lỗi xảy ra" : (
                        <>
                          {query.data.mostRentedProperties.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Link href={`/manage/properties/property/${item.propertyId}`}>
                                  {detailsQuery.isSuccess && (detailsQuery.data.properties.find((property) => property.id === item.propertyId)?.name)}
                                </Link>
                              </TableCell>
                              <TableCell>{item.count}</TableCell>
                            </TableRow>
                          ))}
                          {query.data.properties.length > 4 && (
                            <TableRow>
                              <TableCell>...</TableCell>
                              <TableCell>...</TableCell>
                              <TableCell>...</TableCell>
                            </TableRow>
                          )}
                          {query.data.leastRentedProperties.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{query.data.properties.length - query.data.leastRentedProperties.length + index + 1}</TableCell>
                              <TableCell>
                                <Link href={`/manage/properties/property/${item.propertyId}`}>
                                  {detailsQuery.isSuccess && (detailsQuery.data.properties.find((property) => property.id === item.propertyId)?.name)}
                                </Link>
                              </TableCell>
                              <TableCell>{item.count}</TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="units">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Phòng/Căn hộ</TableHead>
                        <TableHead>Lượt thuê</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {query.isLoading ? (<Spinner size={16} />) : query.isError ? "Đã có lỗi xảy ra" : (
                        <>
                          {query.data.mostRentedUnits.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Link href={`/manage/properties/property/${item.propertyId}`}>
                                  {detailsQuery.isSuccess && (detailsQuery.data.units.find((unit) => unit.id === item.unitId)?.name)}
                                </Link>
                              </TableCell>
                              <TableCell>{item.count}</TableCell>
                            </TableRow>
                          ))}
                          {query.data.units.length > 4 && (
                            <TableRow>
                              <TableCell>...</TableCell>
                              <TableCell>...</TableCell>
                              <TableCell>...</TableCell>
                            </TableRow>
                          )}
                          {query.data.leastRentedUnits.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{query.data.units.length - query.data.leastRentedUnits.length + index + 1}</TableCell>
                              <TableCell>
                                <Link href={`/manage/properties/property/${item.propertyId}`}>
                                  {detailsQuery.isSuccess && (detailsQuery.data.units.find((unit) => unit.id === item.unitId)?.name)}
                                </Link>
                              </TableCell>
                              <TableCell>{item.count}</TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                    </TableBody>
                  </Table>

                </TabsContent>
              </Tabs>

            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
