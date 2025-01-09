// file: ~/server/api/auth/[...].ts
import EmailProvider from 'next-auth/providers/email';

import GithubProvider from 'next-auth/providers/github';

import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { NuxtAuthHandler } from '#auth';
import { getUserByEmail } from '~~/server/db/users';
import { sendEmail } from '~~/server/utils/emailSender.ts';

const prisma = new PrismaClient();

export default NuxtAuthHandler({
  // your authentication configuration here!
  adapter: PrismaAdapter(prisma),
  secret: useRuntimeConfig().authSecret,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: useRuntimeConfig().githubId,
      clientSecret: useRuntimeConfig().githubSecret,
    }),
    EmailProvider.default({
      server: {
        host: useRuntimeConfig().mailSmtp,
        port: useRuntimeConfig().mailPort,
        auth: {
          user: useRuntimeConfig().mailUsername,
          pass: useRuntimeConfig().mailPassword,
        },
      },
      from: useRuntimeConfig().emailFrom,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const templatePath = 'dm/en/magiclink.html';
        try {
          // Use the new sendEmail utility function
          await sendEmail({
            to: identifier,
            subject: 'Log in to FarmLiaison',
            templatePath,
            templateData: { magicLink: url },
            text: `Click the following link to log in to FarmLiaison: ${url}`,
          });
          console.log('Magic link email sent to:', identifier);
        } catch (error) {
          console.error(`Failed to send magic link email: ${error.message}`);
          throw error;
        }
      },
    }),
    // @ts-expect-error
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleId,
      clientSecret: useRuntimeConfig().googleSecret,
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        user.id = existingUser.id;

        // Ensure the account entry exists in the accounts table
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at ? account.expires_at : null,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
              type: 'oauth',
            },
          });
        }
      } else {
        // Create a new user if not existing (only applicable for OAuth)
        if (account.provider !== 'email') {
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: profile?.name || user.name,
              image: profile?.picture || user.image,
            },
          });

          user.id = newUser.id;

          // Create the associated account
          await prisma.account.create({
            data: {
              userId: newUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at
                ? Math.floor(account.expires_at / 1000)
                : null, // Ensure correct format
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
              type: 'oauth', // Ensure this field is populated correctly
            },
          });
        }
      }

      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        const userData = await getUserByEmail(session?.user?.email);
        (session as any).user.id = userData?.id;
        (session as any).user.name = userData?.name;
        (session as any).user.profileImage = userData?.profileImage;
        (session as any).user.type = userData?.type;
        (session as any).user.role = userData?.role;
        (session as any).user.farmSlug = userData?.farmSlug;
        (session as any).user.agreedTerms = userData?.agreedTerms;
      }
      return Promise.resolve(session);
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    // strategy: 'database',
  },
});
