import { signIn, signOut, useSession } from "next-auth/react"
import { ReactNode } from "react"

export default function RootLayout({ children }: { children: ReactNode }) {
  const { update, data, status } = useSession()

  return (
    <>
      {/* <div className="flex h-24 place-content-between bg-slate-500">
        <div className="flex place-items-center px-6 py-1 text-center font-serif text-6xl text-white">
          <h1>Ancestry Origin</h1>
        </div>
        {status === "authenticated" && data != null ? (
          <div>
            <img
              src={data.user.image ?? ""}
              style={{
                width: "50px",
                height: "50px",
              }}
            ></img>
            <span>{data.user.name}</span>
            <button onClick={() => signOut()} className="p-2">
              Sign Out
            </button>
          </div>
        ) : status === "unauthenticated" ? (
          <button
            className="m-3 rounded-md bg-white px-3 py-1 text-center text-2xl text-black"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        ) : (
          ""
        )}
      </div> */}
      <main
        className="flex min-h-screen w-full flex-col"
        style={{
          background: "#F1DEC9",
          backgroundImage: "url(/noise-texture.png)",
        }}
      >
        {children}
      </main>
    </>
  )
}
