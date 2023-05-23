import { Html, Head, Main, NextScript } from "next/document"
import { IM_Fell_English_SC } from "next/font/google"

export default function Document() {
  return (
    <Html>
      <Head title="Ancestry Origin">
        <meta name="description" content="Role-Playing Companion" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=IM+Fell+English+SC:wght@400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
