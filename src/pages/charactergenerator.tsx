import { NextPage } from "next"
import RootLayout from "~/components/layout"
import { useState } from "react"
import { Map } from "immutable"
import CharacterCardSmall from "~/components/CharacterCardSmall"
import { type CharacterData as CharacterDataFetch } from "../server/api/routers/generate"
import { api } from "~/utils/api"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { number } from "zod"

export type CharacterData = {
  imagePath: string
  firstName: string
  lastName: string
  race: string
  class: string
  background: string
  subrace?: string
  gender: string
  ageYears: number
  details: { detail: string; description: string }[]
}

type CardHoverState = "left" | "right" | "none"

type CardAction = "discard" | "save"

function mapFetchData(data: CharacterDataFetch): CharacterData {
  return {
    ...data,
    imagePath: `/portraits/${data.race}-${data.gender}-${data.class}.png`,
    ageYears: data.age,
  }
}

const CharacterGenerator: NextPage = () => {
  const [cardHoverState, setCardHoverState] = useState<CardHoverState>("none")
  const [interactionCooldown, setInteractionCooldown] = useState(false)
  const [savedCards, setSavedCards] = useState<Map<number, CharacterData>>(
    Map()
  )
  const [activeCardId, setActiveCardId] = useState<number | undefined>()
  const [animateRef, toggleAnimate] = useAutoAnimate()

  const generateCharacterQuery = api.generate.character.useQuery()

  const activeCharacterData = generateCharacterQuery.data
    ? mapFetchData(generateCharacterQuery.data)
    : undefined

  function handleCardAction(action: CardAction): void {
    if (activeCharacterData === undefined) return
    setCardHoverState("none")
    setInteractionCooldown(true)
    switch (action) {
      case "discard":
        break
      case "save":
        setSavedCards(
          savedCards.set(
            (savedCards.keySeq().max() ?? 0) + 1,
            activeCharacterData
          )
        )
        break
    }

    generateCharacterQuery.refetch()
  }

  return (
    <RootLayout>
      <div
        onMouseMove={() => setInteractionCooldown(false)}
        className="flex flex-col items-center py-4"
      >
        <h1 className="mt-5 p-5 text-center font-serif text-5xl">
          CHARACTER GENERATOR
        </h1>
        {activeCharacterData === undefined ? (
          <></>
        ) : (
          <div className="my-2 flex w-full max-w-4xl flex-row items-center justify-center px-10">
            <div
              onMouseEnter={() => {
                if (interactionCooldown) return
                // setCardHoverState("left")
              }}
              // onMouseDown={() => handleCardAction("discard")}
              className="flex h-full w-1/5 cursor-pointer flex-col items-center justify-center"
            >
              <button
                className={`w-fit rounded-full border-4 bg-opacity-0 p-4 text-center text-5xl transition-opacity ${
                  cardHoverState === "left" ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  borderColor: "#5C0404",
                }}
              >
                <svg
                  width="35"
                  height="34"
                  viewBox="0 0 35 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M34.5063 25.626L25.3158 16.9991L34.5033 8.37321C34.5938 8.28825 34.6656 8.18738 34.7146 8.07637C34.7636 7.96536 34.7888 7.84638 34.7888 7.72622C34.7888 7.60606 34.7636 7.48708 34.7146 7.37607C34.6656 7.26506 34.5938 7.16419 34.5033 7.07923L28.0672 1.03575C27.8843 0.864118 27.6363 0.7677 27.3778 0.7677C27.1192 0.7677 26.8712 0.864118 26.6883 1.03575L17.4994 9.66167L8.31186 1.03575C7.94632 0.692129 7.29903 0.692129 6.933 1.03575L0.495377 7.07831C0.312793 7.25009 0.210252 7.48286 0.210252 7.72553C0.210252 7.9682 0.312793 8.20096 0.495377 8.37275L9.68435 16.9991L0.493907 25.6264C0.311442 25.7983 0.208984 26.031 0.208984 26.2737C0.208984 26.5163 0.311442 26.749 0.493907 26.9209L6.93055 32.9639C7.02103 33.049 7.12849 33.1165 7.24679 33.1625C7.36509 33.2086 7.49191 33.2323 7.61998 33.2323C7.74805 33.2323 7.87486 33.2086 7.99316 33.1625C8.11146 33.1165 8.21893 33.049 8.30941 32.9639L17.4994 24.3366L26.6898 32.9634C26.8804 33.1419 27.1288 33.2316 27.3792 33.2316C27.6296 33.2316 27.8785 33.1419 28.0691 32.9634L34.5068 26.9204C34.6895 26.7487 34.7921 26.5158 34.792 26.2731C34.792 26.0303 34.6892 25.7976 34.5063 25.626Z"
                    fill="#5C0404"
                  />
                </svg>
              </button>
            </div>
            <div
              onMouseEnter={() => setCardHoverState("none")}
              className="mx-14 flex h-full w-full flex-col items-center justify-center"
            >
              <div
                className="z-0 flex h-full w-full flex-col justify-start px-5 py-7 align-middle transition-transform"
                style={{
                  height: "700px",
                  width: "450px",
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
                      ? 15
                      : cardHoverState === "right"
                      ? -15
                      : 0
                  }deg)`,
                }}
              >
                <img
                  src={activeCharacterData.imagePath}
                  width={400}
                  height={400}
                  alt="character portrait"
                  className="mb-1 w-full rounded-lg border-4"
                  style={{
                    borderColor: "#5C0404",
                    objectFit: "cover",
                    objectPosition: "top",
                    height: "250px",
                  }}
                />
                <div
                  className="mt-1 flex flex-grow flex-col justify-start rounded-lg border-4 py-3 align-middle"
                  style={{ borderColor: "#5C0404" }}
                >
                  <h2 className="py-1 text-center font-serif text-3xl">
                    {activeCharacterData.firstName}
                    {activeCharacterData.lastName
                      ? ` ${activeCharacterData.lastName}`
                      : ""}
                  </h2>
                  <div>
                    <h3 className="px-2 text-center font-serifSub text-sm">
                      {`${activeCharacterData.race} - ${activeCharacterData.class} - ${activeCharacterData.background}`}
                    </h3>
                    <h3 className="px-2 text-center font-serifSub text-sm">
                      {`${
                        activeCharacterData.subrace
                          ? `${activeCharacterData.subrace} - `
                          : ""
                      }${
                        activeCharacterData.gender
                      } - ${activeCharacterData.ageYears.toString()} years`}
                    </h3>
                  </div>
                  <ul className="flex flex-col items-start justify-start gap-1 px-2 py-1 font-serifSub">
                    {activeCharacterData.details.map((d, i) => (
                      <li key={i} className="text-md">
                        <strong>{d.detail}:</strong> {d.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div
              // onMouseDown={() => handleCardAction("save")}
              onMouseEnter={() => {
                if (interactionCooldown) return
                // setCardHoverState("right")
              }}
              className="flex h-full w-1/5 cursor-pointer flex-col items-center justify-center"
            >
              <button
                className={`w-fit rounded-full border-4 bg-opacity-0 p-4 text-center text-5xl transition-opacity ${
                  cardHoverState === "right" ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  borderColor: "#5C0404",
                }}
              >
                <svg
                  width="36"
                  height="33"
                  viewBox="0 0 36 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 32.3625L15.4625 30.0525C6.45 21.88 0.5 16.4725 0.5 9.875C0.5 4.4675 4.735 0.25 10.125 0.25C13.17 0.25 16.0925 1.6675 18 3.89C19.9075 1.6675 22.83 0.25 25.875 0.25C31.265 0.25 35.5 4.4675 35.5 9.875C35.5 16.4725 29.55 21.88 20.5375 30.0525L18 32.3625Z"
                    fill="#5C0404"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div className="flex w-full flex-row justify-center gap-5 py-4">
          <button
            className={`w-fit rounded-full border-4 bg-opacity-0 p-4 text-center text-5xl transition-opacity ${"opacity-100"}`}
            style={{
              borderColor: "#5C0404",
            }}
            onClick={() => handleCardAction("discard")}
          >
            <svg
              width="35"
              height="34"
              viewBox="0 0 35 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M34.5063 25.626L25.3158 16.9991L34.5033 8.37321C34.5938 8.28825 34.6656 8.18738 34.7146 8.07637C34.7636 7.96536 34.7888 7.84638 34.7888 7.72622C34.7888 7.60606 34.7636 7.48708 34.7146 7.37607C34.6656 7.26506 34.5938 7.16419 34.5033 7.07923L28.0672 1.03575C27.8843 0.864118 27.6363 0.7677 27.3778 0.7677C27.1192 0.7677 26.8712 0.864118 26.6883 1.03575L17.4994 9.66167L8.31186 1.03575C7.94632 0.692129 7.29903 0.692129 6.933 1.03575L0.495377 7.07831C0.312793 7.25009 0.210252 7.48286 0.210252 7.72553C0.210252 7.9682 0.312793 8.20096 0.495377 8.37275L9.68435 16.9991L0.493907 25.6264C0.311442 25.7983 0.208984 26.031 0.208984 26.2737C0.208984 26.5163 0.311442 26.749 0.493907 26.9209L6.93055 32.9639C7.02103 33.049 7.12849 33.1165 7.24679 33.1625C7.36509 33.2086 7.49191 33.2323 7.61998 33.2323C7.74805 33.2323 7.87486 33.2086 7.99316 33.1625C8.11146 33.1165 8.21893 33.049 8.30941 32.9639L17.4994 24.3366L26.6898 32.9634C26.8804 33.1419 27.1288 33.2316 27.3792 33.2316C27.6296 33.2316 27.8785 33.1419 28.0691 32.9634L34.5068 26.9204C34.6895 26.7487 34.7921 26.5158 34.792 26.2731C34.792 26.0303 34.6892 25.7976 34.5063 25.626Z"
                fill="#5C0404"
              />
            </svg>
          </button>
          <button
            className={`w-fit rounded-full border-4 bg-opacity-0 p-4 text-center text-5xl transition-opacity ${"opacity-100"}`}
            style={{
              borderColor: "#5C0404",
            }}
            onClick={() => handleCardAction("save")}
          >
            <svg
              width="36"
              height="33"
              viewBox="0 0 36 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 32.3625L15.4625 30.0525C6.45 21.88 0.5 16.4725 0.5 9.875C0.5 4.4675 4.735 0.25 10.125 0.25C13.17 0.25 16.0925 1.6675 18 3.89C19.9075 1.6675 22.83 0.25 25.875 0.25C31.265 0.25 35.5 4.4675 35.5 9.875C35.5 16.4725 29.55 21.88 20.5375 30.0525L18 32.3625Z"
                fill="#5C0404"
              />
            </svg>
          </button>
        </div>
        <div className="h-20"></div>
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
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(
                savedCards
                  .valueSeq()
                  .map((data) => ({
                    ...data,
                    ageYears: undefined,
                    imagePath: undefined,
                  }))
                  .toArray(),
                null,
                2
              )
            )}`}
            download={"saved-characters.json"}
            className="font-serif"
            style={{
              fontSize: "48px",
              lineHeight: "61px",
              textAlign: "center",
              color: "#362715",
            }}
          >
            Export
          </a>
        </div>
        <div className="max-w-6xl py-6">
          <ul
            ref={animateRef}
            className="flex flex-row flex-wrap items-start justify-center gap-4"
          >
            {savedCards
              .entrySeq()
              .map(([key, val]) => (
                <li
                  className={`relative transition-opacity ${
                    activeCardId !== undefined && key === activeCardId
                      ? `opacity-50`
                      : ``
                  }`}
                  onMouseEnter={() => setActiveCardId(key)}
                  onMouseLeave={() => setActiveCardId(undefined)}
                  key={key}
                >
                  <div className="absolute z-50 flex h-full w-full items-center justify-center">
                    <button
                      className={`w-fit rounded-full border-4 bg-opacity-0 p-4 text-center text-5xl transition-opacity ${
                        activeCardId !== undefined && key === activeCardId
                          ? `opacity-100`
                          : `opacity-0`
                      }`}
                      style={{
                        borderColor: "#5C0404",
                      }}
                      onClick={() => setSavedCards(savedCards.delete(key))}
                    >
                      <svg
                        width="35"
                        height="34"
                        viewBox="0 0 35 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M34.5063 25.626L25.3158 16.9991L34.5033 8.37321C34.5938 8.28825 34.6656 8.18738 34.7146 8.07637C34.7636 7.96536 34.7888 7.84638 34.7888 7.72622C34.7888 7.60606 34.7636 7.48708 34.7146 7.37607C34.6656 7.26506 34.5938 7.16419 34.5033 7.07923L28.0672 1.03575C27.8843 0.864118 27.6363 0.7677 27.3778 0.7677C27.1192 0.7677 26.8712 0.864118 26.6883 1.03575L17.4994 9.66167L8.31186 1.03575C7.94632 0.692129 7.29903 0.692129 6.933 1.03575L0.495377 7.07831C0.312793 7.25009 0.210252 7.48286 0.210252 7.72553C0.210252 7.9682 0.312793 8.20096 0.495377 8.37275L9.68435 16.9991L0.493907 25.6264C0.311442 25.7983 0.208984 26.031 0.208984 26.2737C0.208984 26.5163 0.311442 26.749 0.493907 26.9209L6.93055 32.9639C7.02103 33.049 7.12849 33.1165 7.24679 33.1625C7.36509 33.2086 7.49191 33.2323 7.61998 33.2323C7.74805 33.2323 7.87486 33.2086 7.99316 33.1625C8.11146 33.1165 8.21893 33.049 8.30941 32.9639L17.4994 24.3366L26.6898 32.9634C26.8804 33.1419 27.1288 33.2316 27.3792 33.2316C27.6296 33.2316 27.8785 33.1419 28.0691 32.9634L34.5068 26.9204C34.6895 26.7487 34.7921 26.5158 34.792 26.2731C34.792 26.0303 34.6892 25.7976 34.5063 25.626Z"
                          fill="#5C0404"
                        />
                      </svg>
                    </button>
                  </div>
                  <CharacterCardSmall tilt="none" data={val} />
                </li>
              ))
              .toArray()}
          </ul>
        </div>
      </div>
    </RootLayout>
  )
}

export default CharacterGenerator
