import { NextPage } from "next"

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
  return (
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
          <GeneratorLinkButton href="" text="Old German"></GeneratorLinkButton>
          <GeneratorLinkButton href="" text="Old Roman"></GeneratorLinkButton>
        </div>
      </div>
    </main>
  )
}

export default Home
