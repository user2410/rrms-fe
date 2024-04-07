import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: string;
      accessExp: string;
      refreshToken: string;
      refreshExp: string;
      user: {
        id: string;
        email: string;
        created_at: string;
        created_by: string;
        updated_at: string;
        deleted_f: boolean;
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        district: string;
        ward: string;
        phone: string;
        avatar: string;
        role: string;
      }
    }
  }
}
