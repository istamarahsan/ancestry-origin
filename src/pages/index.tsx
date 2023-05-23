import { NextPage } from "next"
import Head from "next/head"

type GeneratorLinkButtonProps = {
  text: string
  onClick: () => void
}

const GeneratorLinkButton: React.FC<GeneratorLinkButtonProps> = (
  props: GeneratorLinkButtonProps
) => {
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
      <button
        className="font-serif"
        onClick={props.onClick}
        style={{
          fontSize: "48px",
          lineHeight: "61px",
          textAlign: "center",
          color: "#362715",
        }}
      >
        {props.text.toUpperCase()}
      </button>
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
            onClick={() => {}}
            text="Old English"
          ></GeneratorLinkButton>
          <GeneratorLinkButton
            onClick={() => {}}
            text="Old German"
          ></GeneratorLinkButton>
          <GeneratorLinkButton
            onClick={() => {}}
            text="Old Roman"
          ></GeneratorLinkButton>
        </div>
      </div>
    </main>
  )
}

export default Home
