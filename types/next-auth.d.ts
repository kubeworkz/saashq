// eslint-disable-next-line no-use-before-define
import { Product, Role } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: Role;
      image: string;
      email: string;
      name: string;
      isAdmin: boolean;
      product: Product | null;
      stripeCustomerId: string;
      onboarded: boolean;
    } & DefaultSession['user'];
  }
}
