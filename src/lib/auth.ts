import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import ResendProvider from "next-auth/providers/resend";

import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/resend";
import { magicLinkEmail } from "@/emails/magic-link";

/**
 * Auth exists only for the sender dashboard. Nobody has to sign in to buy, and
 * recipients never have accounts at all — a magic link to the address used at
 * checkout is enough to reveal that sender's history.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin/check",
    error: "/signin",
  },
  providers: [
    ResendProvider({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
      // Branded sign-in email instead of Auth.js's default.
      async sendVerificationRequest({ identifier, url }) {
        const { subject, html, text } = magicLinkEmail({ url });
        const result = await sendEmail({ to: identifier, subject, html, text });
        if (!result.ok) {
          throw new Error(`Could not send sign-in email: ${result.error}`);
        }
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
});
