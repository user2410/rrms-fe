import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { Contract } from "@/models/contract";
import { useQuery } from "@tanstack/react-query";
import { lazy, useEffect, useRef, useState } from "react";
import printContract from "../../_actions/print_contract";
import { useDataCtx } from "../../_context/data.context";
import Editor from "./editor";
import { useFormContext } from "react-hook-form";
import { ContractBFormValues } from "./create_contract_b";
import { FormControl, FormField, FormItem } from "@/components/ui/form";

const mapPTypeToTemplate = {
  'APARTMENT': lazy(() => import('./apartment_template')),
  'PRIVATE': lazy(() => import('./private_template')),
  'ROOM': lazy(() => import('./room_template')),
  'STORE': lazy(() => import('./private_template')),
  'VILLA': lazy(() => import('./private_template')),
  'OFFICE': lazy(() => import('./office_template')),
  'MINIAPARTMENT': lazy(() => import('./apartment_template')),
};

export default function ContractEditorWrapper() {
  const data = useDataCtx();

  const query = useQuery<Contract>({
    queryKey: ["manage", "rentals", "rental", data.rental.id, 'contract', data.sessionData.user.accessToken],
    queryFn: async ({queryKey}) => {
      return (await backendAPI.get<Contract>(`/api/rentals/rental/${data.rental.id}/contract`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        }
      })).data;
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  return query.isLoading ? (
    <div className="">
      Đang tải dữ liệu...
    </div>
  ) : query.isError ? (
    <div>
      Đã xảy ra lỗi khi tải dữ liệu
    </div>
  ) : (
    <ContractEditor contract={query.data}/>
  );
}

function ContractEditor({
  contract,
} : {
  contract: Contract;
}) {
  const form = useFormContext<ContractBFormValues>();
  const data = useDataCtx();
  const ref = useRef<HTMLDivElement>();

  const Template = mapPTypeToTemplate[data.property.type as keyof typeof mapPTypeToTemplate];

  useEffect(() => {
    if (ref.current) {
      form.setValue("content", ref.current.innerHTML);
    }
  }, [ref.current]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nội dung hợp đồng</CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Editor {...field}/>
              </FormControl>
            </FormItem>
          )}
        />
        {/* @ts-ignore */}
        <Template ref={ref} className="hidden" contract={{...contract, ...form.getValues()}} data={data} />
        <table border={0} cellPadding={0} cellSpacing={0} style={{
          border: "#d3d3d3 1px dotted",
          width: "100%",
        }}>
          <tbody>
            <tr>
              <td>
                <p style={{ textAlign: "center" }}><strong><span style={{ fontFamily: "times new roman,times,serif" }}>BÊN CHO THUÊ</span></strong></p>
                <p style={{ textAlign: "center" }}><em><span style={{ fontFamily: "times new roman,times,serif" }}>(ký và ghi rõ họ tên)</span></em></p>
              </td>
              <td>
                <p style={{ textAlign: "center" }}><strong><span style={{ fontFamily: "times new roman,times,serif" }}>BÊN THUÊ</span></strong></p>
                <p style={{ textAlign: "center" }}><em><span style={{ fontFamily: "times new roman,times,serif" }}>(ký và ghi rõ họ tên)</span></em></p>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
