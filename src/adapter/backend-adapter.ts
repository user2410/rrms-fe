import { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import { AxiosInstance } from "axios";

export function BackendAdapter(be: AxiosInstance) : Adapter {
  return {
    // createUser: async (data: Omit<AdapterUser, "id">) => {
    //   return null;
    // },
    getUser: async (id: string) => {
      return null;
    },
    getUserByEmail: async (email: string) => {
      return null;
    },
    // getUserByAccount: async (providerId: string, providerAccountId: string) => {
    //   return null;
    // },
    // updateUser: async (user: AdapterUser) => {
    //   return null;
    // },
    deleteUser: async (userId: string) => {

    },
    linkAccount: async (data) => {

    },
    unlinkAccount: async (data) => {

    },
    getSessionAndUser: async (sessionToken) => {
      return null;
    },
    // createSession: async (data) => {
    //   return null;
    // },
    updateSession: async (data) => {
      return null;
    },
    deleteSession: async (sessionToken) => {

    },
  };
}