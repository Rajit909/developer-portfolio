
import type { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from './mongodb';
import { findUserByEmail, createUser } from './user';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: 'portfolio-data',
  }),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await findUserByEmail(credentials.email);

        if (!user || !user.password) {
          // User not found or doesn't have a password (e.g., OAuth account)
          return null;
        }
        
        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          console.log(`Invalid password for user ${credentials.email}`);
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
        }
        return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
