import { backendAPI } from "@/libs/axios";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  // adapter: BackendAdapter(axiosInstance),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        admin: { label: "Admin", type: "text"},
        accessToken: { label: "AccessToken", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials: missing field");
        }

        try {
          console.log(`/api/auth/credential/login${credentials.admin ? "?admin=true" : ""}`);
          const res = await backendAPI.post(
            `/api/auth/credential/login${credentials.admin ? "?admin=true" : ""}`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                Authorization: credentials.accessToken ? `Bearer ${credentials.accessToken}` : undefined,
              }
            },
          );
          if (res.status === 401) {
            return null;
          }
          console.log("authorize log:", res);
          // res.data containing accessToken, accessExp, refreshToken, refreshExp and user info
          // Any object returned will be saved in `user` property of the JWT
          return res.data;
        } catch (err) {
          console.error(err);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    // In jwt object we are calling the async function that stores our response in token.
    async jwt({ token, user}) {
      console.log("jwt token log:", token); // full response from backend
      console.log("jwt user log:", user); // undefined

      // if (account && user) {
      //   return {
      //     ...token,
      //     accessToken: user.token,
      //     refreshToken: user.refreshToken,
      //   };
      // }

      return {...token, ...user};
    },
    // use the useSession hook in the client-side to get information that we pass to session object.
    async session({session, token, user}) {
      console.log("session session log:", session); // {user: { name: undefined, email: undefined, image: undefined },expires: }
      console.log("session token log:", token); // full response from backend
      console.log("session user log:", user); // undefined

      session.user = token as any;
      // session.user.accessToken = token.accessToken;
      return session;
    },
  },
  // session: {
  //   maxAge: parseInt(process.env.SESSION_MAX_AGE || "900"), // 15 minutes,
  // },
  debug: process.env.NODE_ENV !== "production",
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);