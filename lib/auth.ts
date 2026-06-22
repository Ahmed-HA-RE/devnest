import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './db';
import { createAuthMiddleware } from 'better-auth/api';
import { APP_NAME } from './constants/app';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  appName: APP_NAME,

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // This runs after every auth action, including social logins to make sure if user cancelled the social login flow, we redirect them back to the sign-in page instead of showing an error.
      if (
        ctx.query?.error === 'state_mismatch' ||
        ctx.query?.error === 'access_denied'
      ) {
        ctx.redirect('/sign-in');
      }
    }),
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      prompt: 'select_account',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: 'select_account',
    },
  },
});
