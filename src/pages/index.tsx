import { stat } from "fs"
import { NextPage } from "next"
import { useSession } from "next-auth/react"

type GeneratorLinkButtonProps = {
  text: string
  href: string
}

const GeneratorLinkButton: React.FC<GeneratorLinkButtonProps> = ({
  text,
  href,
}: GeneratorLinkButtonProps) => {
  return (
    <div
      className="flex place-content-center p-3"
      style={{
        boxSizing: "border-box",
        background: "#C8B6A6",
        border: "5px solid #5E4529",
        borderRadius: "20px",
      }}
    >
      <a
        href={href}
        className="font-serif"
        style={{
          fontSize: "48px",
          lineHeight: "61px",
          textAlign: "center",
          color: "#362715",
        }}
      >
        {text.toUpperCase()}
      </a>
    </div>
  )
}

const Home: NextPage = () => {
  const { data, status } = useSession()

  return (
    <>
      <div
        className="flex h-20 place-content-end"
        style={{
          backgroundColor: "white",
        }}
      >
        {status === "authenticated" && data != null ? (
          <div>
            <img
              src={data.user.image ?? ""}
              style={{
                width: "50px",
                height: "50px",
              }}
            ></img>
            {data.user.name}
          </div>
        ) : status === "unauthenticated" ? (
          <a href="/api/auth/signin" style={{ color: "black" }}>
            Sign Up
          </a>
        ) : (
          ""
        )}
      </div>
      <main
        className="flex min-h-screen flex-col items-center justify-center"
        style={{
          background: "#F1DEC9",
          backgroundImage: "url(/noise-texture.png)",
        }}
      >
        <div className="flex flex-col" style={{ maxWidth: "500px" }}>
          <h1
            className={`my-10 font-serif`}
            style={{
              textAlign: "center",
              fontSize: "95px",
              color: "#362715",
              lineHeight: "121px",
            }}
          >
            ANCESTRY ORIGIN
          </h1>
          <div className="flex flex-col gap-10">
            <GeneratorLinkButton
              href="/namegenerator"
              text="Old English"
            ></GeneratorLinkButton>
            <GeneratorLinkButton
              href="/namegenerator"
              text="Old German"
            ></GeneratorLinkButton>
            <GeneratorLinkButton
              href="/namegenerator"
              text="Old Roman"
            ></GeneratorLinkButton>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
