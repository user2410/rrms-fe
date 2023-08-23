import { axiosInstance } from '@/libs/axios';
import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  // adapter: BackendAdapter(axiosInstance),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // console.log('authorize log req:', req);
        // console.log('authorize log credential:', credentials);
        // console.log('authorize log credential.email:', credentials?.email);
        // console.log('authorize log credential.email:', !credentials?.email);
        // console.log('authorize log credential.password:', credentials?.password);
        // console.log('authorize log credential.password:', !credentials?.password);
        // console.log('authorize log credential bool:', !credentials?.email || !credentials.password);


        if (!credentials?.email || !credentials.password) {
					throw new Error('Invalid credentials: missing field')
				}

        try {
          console.log('querying server')
          const res = await axiosInstance.post('/api/auth/credential/login', credentials);
          if(res.status === 401) {
            return null;
          }
          console.log('authorize log:', res)
          // res.data containing accessToken, accessExp and user info
          // Any object returned will be saved in `user` property of the JWT
          return res.data;
        } catch (err) {
          console.error(err);
          throw new Error('Invalid credentials')
        }
			},
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      console.log('jwt token log:', token);
      console.log('jwt user log:', user);
      
      return {...token, ...user};
    },
    async session({session, token, user}) {
      console.log('session session log:', session);
      console.log('session token log:', token);
      console.log('session user log:', user);

      session.user = token as any;
      return session;
    }
  },
  debug: process.env.NODE_ENV !== 'production',
}

export default NextAuth(authOptions);