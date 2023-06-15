import { type NextAuthOptions, type DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { env } from "~/env.mjs"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  providers: [],
}
