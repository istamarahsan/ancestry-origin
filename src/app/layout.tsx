import { IM_Fell_English_SC } from "next/font/google"
import Head from "next/head"

const imFellEnglish = IM_Fell_English_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-imFellEnglishSc",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${imFellEnglish.variable}`}>
      <Head>
        <title>Ancestry Origin</title>
      </Head>
      <body>{children}</body>
    </html>
  )
}
