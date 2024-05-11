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
        createdAt: string;
        createdBy: string;
        updatedAt: string;
        deletedF: boolean;
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
