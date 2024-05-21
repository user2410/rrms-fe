import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PersonalInfoForm } from "./account_form";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { backendAPI } from "@/libs/axios";
import { AccountAuth } from "./account_auth";
import { User } from "@/models/user";

export default function AccountTab() {
  const session = useSession();

  const query = useQuery<User>({
    queryKey: ["manage", "my-account", session.data?.user.accessToken],
    queryFn: async ({queryKey}) => {
      return (await backendAPI.get<User>("/api/auth/credential/me", {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data;
    },
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60, // 1 minute
    cacheTime: 1000 * 60, // 1 hour
  });

  return (
    <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Thông tin cá nhân</AccordionTrigger>
        <AccordionContent>
          {query.isLoading
            ? (<p>Loading...</p>)
            : query.isError
              ? (<p>Error: {JSON.stringify(query.error)}</p>)
              : session.status === "authenticated" ? (
                <PersonalInfoForm 
                  accessToken={session.data!.user.accessToken}
                  user={query.data} 
                />
              ) : null}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Bảo mật</AccordionTrigger>
        <AccordionContent>
          {query.isLoading
            ? (<p>Loading...</p>)
            : query.isError
              ? (<p>Error: {JSON.stringify(query.error)}</p>)
              : (
                <AccountAuth
                  currentEmail={query.data.email}
                  userId={query.data.id}
                />
              )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Dữ liệu</AccordionTrigger>
        <AccordionContent>
          <h2 className="text-lg font-semibold">Vô hiệu hóa tài khoản của tôi</h2>
          <p>Điều này sẽ vô hiệu hóa tài khoản của bạn và xóa tất cả dữ liệu của bạn khỏi RRMS. Bạn có chắc chắn muốn tiếp tục?</p>
          <Button type="button" variant="destructive" className="my-2">Vô hiệu hóa tài khoản</Button>
          <Separator />
          <h2 className="text-lg font-semibold">Dữ liệu cá nhân</h2>
          <p>Xem dữ liệu được lưu trên RRMS</p>
          <Button type="button" variant="outline" className="my-2">Download CSV</Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
