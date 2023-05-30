import { ReactNode } from "react"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main
      className="flex min-h-screen w-full flex-col"
      style={{
        background: "#F1DEC9",
        backgroundImage: "url(/noise-texture.png)",
      }}
    >
      {children}
    </main>
  )
}
