import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFieldArray, useForm, useFormContext, UseFormReturn } from "react-hook-form";
import { FormValues } from "../page";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useReducer } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDataCtx } from "../_context/data.context";
import { useQuery } from "@tanstack/react-query";
import { Listing, rentalPolicies } from "@/models/listing";
import { backendAPI } from "@/libs/axios";
import { Application } from "@/models/application";

export default function OtherPolicies() {
  const form = useFormContext<FormValues>();
  const {sessionData} = useDataCtx();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "policies.policies",
  });
  const application = form.watch("application") as Application;

  const query = useQuery<Listing>({
    queryKey: ["listings", "listing", application?.listingId],
    queryFn: async ({queryKey}) => {
      return (await backendAPI.get(`/api/listings/listing/${queryKey.at(2)}`, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        }
      })).data;
    },
    enabled: !!application?.listingId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if(query.status !== "success" || fields.length > 0) {
      return;
    }
    query.data.policies.forEach(policy => {
      const rp = rentalPolicies.find(p => p.id === policy.policyId);
      append({
        title: rp?.text || "",
        content: policy.note,
      });
    });
  }, [query.status, fields]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Các quy định khác</CardTitle>
        <AddPolicyDialog form={form} />
      </CardHeader>
      <CardContent className="space-y-2">
        {fields.length === 0 && (
          <div className="text-center">Chưa có quy định nào</div>
        )}
        {fields.map((policy, index) => (
          <div className="border py-2 px-4" key={index}>
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-lg font-semibold">{policy.title}</h2>
              <Button type="button" variant="destructive" onClick={() => remove(index)}>Xóa</Button>
            </div>
            <p className="text-md font-normal">{policy.content}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

type MinorFormState = {
  title: string;
  content: string;
}

type MinorFormAction =
  | { type: "title"; value: string }
  | { type: "content"; value: string }
  | { type: "reset" };

const minorFormInitialState: MinorFormState = {
  title: "",
  content: "",
};

function minorFormReducer(state: MinorFormState, action: MinorFormAction) {
  switch (action.type) {
    case "title":
      return { ...state, title: action.value };
    case "content":
      return { ...state, content: action.value };
    case "reset":
      return minorFormInitialState;
    default:
      return state;
  }
}

function AddPolicyDialog({ form }: { form: UseFormReturn<FormValues> }) {
  const [state, dispatch] = useReducer(minorFormReducer, minorFormInitialState);

  return (
    <Dialog onOpenChange={() => dispatch({ type: "reset" })}>
      <DialogTrigger asChild>
        <Button type="button">Thêm quy định</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm quy định</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 my-2">
          <div className="space-y-2">
            <Label>Quy định <span className="text-red-600 ml-2">*</span></Label>
            <Input
              type="text"
              value={state.title}
              onChange={(e) => dispatch({ type: "title", value: e.currentTarget.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Nội dung <span className="text-red-600 ml-2">*</span></Label>
            <Textarea
              rows={3}
              value={state.content}
              onChange={(e) => dispatch({ type: "content", value: e.currentTarget.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Hủy</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={() => {
              form.setValue("policies.policies", [...form.getValues("policies.policies"), state]);
            }}>Thêm</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
