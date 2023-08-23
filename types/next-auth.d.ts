import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      accessExp: string;
      user: {
        id: string;
        email: string;
        created_at: string;
        created_by: string;
        updated_at: string;
        deleted_f: boolean;
      }
    }
  }
}