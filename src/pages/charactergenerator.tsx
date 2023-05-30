import { NextPage } from "next"
import RootLayout from "~/components/layout"
import Image from "next/image"
import { useState } from "react"

type CardHoverState = "left" | "right" | "none"

const CharacterGenerator: NextPage = () => {
  const [cardHoverState, setCardHoverState] = useState<CardHoverState>("none")

  return (
    <RootLayout>
      <div className="flex flex-col items-center">
        <h1 className="p-5 text-center font-serif text-4xl">
          CHARACTER GENERATOR
        </h1>
        <div className="relative my-10 flex w-full max-w-2xl flex-col place-items-center px-10">
          <div
            onMouseLeave={() => setCardHoverState("none")}
            className="row absolute z-10 flex h-full w-full flex-row justify-between"
          >
            <div
              onMouseEnter={() => setCardHoverState("left")}
              className="flex h-full w-1/3 flex-col items-center justify-center"
            >
              <button
                className={`mr-10 w-fit cursor-pointer rounded-lg bg-red-500 p-3 text-center text-5xl transition-opacity ${
                  cardHoverState === "left" ? "opacity-100" : "opacity-0"
                }`}
              >
                Discard
              </button>
            </div>
            <div
              onMouseEnter={() => setCardHoverState("none")}
              className="h-full w-1/3"
            ></div>
            <div
              onMouseEnter={() => setCardHoverState("right")}
              className="flex h-full w-1/3 flex-col items-center justify-center"
            >
              <h2
                className={`ml-10 w-fit cursor-pointer rounded-lg bg-green-500 p-3 text-center text-5xl transition-opacity ${
                  cardHoverState === "right" ? "opacity-100" : "opacity-0"
                }`}
              >
                Keep
              </h2>
            </div>
          </div>
          <div
            className="z-0 flex max-w-sm flex-col justify-start px-5 py-7 align-middle transition-transform"
            style={{
              boxSizing: "border-box",
              background: "#C8B6A6",
              border: "5px solid #5E4529",
              borderRadius: "20px",
              transform: `translateX(${
                cardHoverState === "left"
                  ? "5rem"
                  : cardHoverState === "right"
                  ? "-5rem"
                  : "0rem"
              }) rotate(${
                cardHoverState === "left"
                  ? 10
                  : cardHoverState === "right"
                  ? -10
                  : 0
              }deg)`,
            }}
          >
            <Image
              src={"/artificer-female.jpg"}
              width={414}
              height={432}
              alt="character portrait"
              className=" w-full border border-black"
            />
            <div className="flex flex-col justify-start py-3 align-middle">
              <h2 className="py-1 text-center text-3xl">{"Hama Mostana"}</h2>
              <h3 className="p-2 text-center text-xl">
                {"Human - Monk (Way of the Astral Self) - Soldier"}
              </h3>
              <h3 className="p-2 text-center text-xl">
                {"Calishite - Female - 25 years"}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}

export default CharacterGenerator
