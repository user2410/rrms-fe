import { backendAPI } from "@/libs/axios";
import { Application } from "@/models/application";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { User } from "@/models/user";
import { RentalData } from "../_context/data.context";

export default async function fetchData(queryKey: string[], accessToken: string) {
  var application: Application | undefined;
  if (queryKey.at(4)) {
    application = (await backendAPI.get<Application>(`/api/applications/application/${queryKey.at(4)}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })).data;
  }

  const property = (await backendAPI.get<Property>(`/api/properties/property/${queryKey.at(5)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })).data;

  const unit = (await backendAPI.get<Unit>(`/api/units/unit/${queryKey.at(6)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })).data;

  const userIds: string[] = [...property.managers.map(pm => pm.managerId)];
  if (application && application?.creatorId !== '00000000-0000-0000-0000-000000000000') {
    userIds.push(application.creatorId);
  }
  const users = (await backendAPI.get<User[]>("/api/auth/credential/ids", {
    params: {
      ids: userIds,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })).data;

  return {
    application,
    property,
    unit,
    tenant: users.find(u => (u.id === application?.creatorId)),
    owners: users.filter(u => property.managers.find(m => m.managerId === u.id && m.role === "OWNER")),
    managers: users.filter(u => property.managers.find(m => m.role === "MANAGER" && m.managerId === u.id)),
  } as RentalData;
};
