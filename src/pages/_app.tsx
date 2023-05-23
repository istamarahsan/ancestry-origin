import { type AppType } from "next/app"
import { type Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

import { api } from "~/utils/api"

import "~/styles/globals.css"
import { IM_Fell_English_SC } from "next/font/google"
import Head from "next/head"

const imFellEnglish = IM_Fell_English_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-imFellEnglishSc",
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
