import { backendAPI } from "@/libs/axios";
import { Session, User } from "next-auth";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  // adapter: BackendAdapter(axiosInstance),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials: missing field");
        }

        try {
          const res = await backendAPI.post(
            "/api/auth/credential/login",
            credentials,
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
    async jwt({ token, trigger, user, session}) {
      console.log("jwt token log:", token); // full response from backend
      console.log("jwt user log:", user); // undefined
      console.log("jwt session log:", session); //

      // if (account && user) {
      //   return {
      //     ...token,
      //     accessToken: user.token,
      //     refreshToken: user.refreshToken,
      //   };
      // }
      if (trigger === "update" && session?.accessToken && session?.accessExp) {
        console.log("update session: ", session);
        token.accessToken = session.accessToken;
        token.accessExp = session.accessExp;
      }

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
  events: {
    async signIn(message) {
      console.log("signIn message log:", message); // {user: full response from backend, account: {providerAccountId: undefined,type: 'credentials',provider: 'credentials'}}
      // @ts-expect-error
      const user = message.user as Session['user'];
      const userId = user.user.id;
    },
  },
  // session: {
  //   maxAge: parseInt(process.env.SESSION_MAX_AGE || "900"), // 15 minutes,
  // },
  debug: process.env.NODE_ENV !== "production",
};

export default NextAuth(authOptions);
