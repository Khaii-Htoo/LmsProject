import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

import { admin, emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite"
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "LMS <onboarding@resend.dev>",
          to: [email],
          subject: " LMS - Verify your email",
          // react: EmailTemplate({ firstName: "John" }),
          html: `Your OTP is <strong>${otp}</strong>`,
        });
      },
    }),
    admin(),
  ],
});
