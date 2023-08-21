import { BackendAdapter } from '@/adapter/backend-adapter';
import { axiosInstance } from '@/libs/axios';
import NextAuth, { AuthOptions } from 'next-auth';
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
					throw new Error('Invalid credentials')
				}

        try {
          return await axiosInstance.post('/api/auth/login', credentials);
        } catch (err) {
          throw new Error('Invalid credentials')
        }
			},
    })
  ],
  debug: process.env.NODE_ENV !== 'production',
}