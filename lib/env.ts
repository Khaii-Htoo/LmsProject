import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
  },

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {},
});

// DATABASE_URL=postgresql://neondb_owner:npg_ZFHOo69BbUeD@ep-blue-night-a8rpdnfz-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require
// BETTER_AUTH_SECRET=X93GXxURe6XVS6SkHjF57p6nVYHiGU5a
// BETTER_AUTH_URL=http://localhost:3000
// GITHUB_CLIENT_ID=Ov23libDETcfxQjqyP7Q
// GITHUB_CLIENT_SECRET=d8ff6b45eab3b96e5e6d3793f84ab221912fb44f
// RESEND_API_KEY=re_85g2DhY8_FtH8TssA3cHreAobA4dWHHjr
