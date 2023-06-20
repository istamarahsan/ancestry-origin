import { NextPage } from "next"
import RootLayout from "~/components/layout"
import { useState } from "react"
import { Map } from "immutable"
import CharacterCardSmall from "~/components/CharacterCardSmall"
import {
  type CharacterData,
  type ItemData,
} from "../server/api/routers/generate"
import { api } from "~/utils/api"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { capitalize } from "lodash"
import ItemCardSmall from "~/components/ItemCardSmall"
import { signIn, useSession } from "next-auth/react"
import { type SavedData } from "~/server/api/routers/saved"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

type CardAction = "discard" | "save"

type ActionMode = "generate" | "manage"

type GenerationMode = CharacterGenerationMode | ItemGenerationMode

type CharacterGenerationMode = {
  type: "character"
}

type ItemGenerationMode = {
  type: "item"
}

type CharacterCardGenProps = {
  data: CharacterData
}

const CharacterCardGen = ({ data }: CharacterCardGenProps) => {
  return (
    <div
      className="z-0 flex h-full w-full max-w-md flex-col justify-start border-4 border-nightingale bg-vanilla px-5 py-7 align-middle transition-transform"
      style={{
        height: "700px",
        boxSizing: "border-box",
        borderRadius: "20px",
      }}
    >
      <img
        src={data.imagePath}
        width={400}
        height={400}
        alt="character portrait"
        className="mb-1 w-full rounded-lg border-4 border-rosewood"
        style={{
          objectFit: "cover",
          objectPosition: "top",
          height: "250px",
        }}
      />
      <div className="mt-1 flex flex-grow flex-col justify-start rounded-lg border-4 border-rosewood py-3 align-middle">
        <h2 className="py-1 text-center font-serif text-3xl">
          {data.firstName}
          {data.lastName ? ` ${data.lastName}` : ""}
        </h2>
        <div>
          <h3 className="px-2 text-center font-serifSub text-sm">
            {`${data.race} - ${data.class} - ${data.background}`}
          </h3>
          <h3 className="px-2 text-center font-serifSub text-sm">
            {`${data.gender} - ${data.age.toString()} years`}
          </h3>
        </div>
        <ul className="flex flex-col items-start justify-start gap-1 px-2 py-1 font-serifSub">
          {data.details.map((d, i) => (
            <li key={i} className="text-md">
              <strong>{d.detail}:</strong> {d.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

type ItemCardGenProps = {
  data: ItemData
}

const ItemCardGen = ({ data }: ItemCardGenProps) => {
  return (
    <div
      className="z-0 flex h-full w-full max-w-md flex-col justify-start border-4 border-nightingale bg-vanilla px-5 py-7 align-middle transition-transform"
      style={{
        height: "700px",
        boxSizing: "border-box",
        borderRadius: "20px",
      }}
    >
      <img
        src={data.imagePath}
        width={400}
        height={400}
        alt="item illustration"
        className="mb-1 w-full rounded-lg border-4 border-rosewood"
        style={{
          objectFit: "cover",
          objectPosition: "top",
          height: "250px",
        }}
      />
      <div className="mt-1 flex flex-grow flex-col justify-start rounded-lg border-4 border-rosewood py-3 align-middle">
        <h2 className="py-1 text-center font-serif text-3xl">{data.kind}</h2>
        <div>
          <h3 className="px-2 text-center font-serifSub text-lg">
            {capitalize(data.category)} - {capitalize(data.style)}
          </h3>
          <p className="p-1 text-center font-serifSub text-sm">
            {data.description}
          </p>
        </div>
        <ul className="flex flex-col items-start justify-start gap-1 px-2 py-1 font-serifSub">
          {[
            ["History", data.history],
            ["Property", data.property],
            ["Quirk", data.quirk],
          ].map(([detail, description], i) => (
            <li key={i} className="text-md">
              <strong>{detail}:</strong> {description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const Generator: NextPage = () => {
  const [actionMode, setActionMode] = useState<ActionMode>("generate")
  const [savedCards, setSavedCards] = useState<Map<number, SavedData>>(Map())
  const [selectedCardId, setSelectedCardId] = useState<number | undefined>()
  const { data: session, status: authStatus } = useSession()
  const [isActionCooldown, setActionCooldown] = useState<boolean>(false)

  const [animateRef, _] = useAutoAnimate()
  const generateCharacterQuery = api.generate.character.useQuery()
  const generateItemQuery = api.generate.item.useQuery()
  const saveToAccountMutation = api.saved.saveToUser.useMutation({
    onSuccess(_data, _variables, _context) {
      toast.success("Saved to account!", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
      })
      setSavedCards(Map())
    },
  })

  const [generationMode, setGenerationMode] = useState<GenerationMode>({
    type: "character",
  })

  const selectedCard = selectedCardId
    ? savedCards.get(selectedCardId)
    : undefined

  if (selectedCardId === undefined && savedCards.size > 0) {
    setSelectedCardId(savedCards.keySeq().min())
  }

  function handleCardAction(action: CardAction): void {
    if (
      generateCharacterQuery.data === undefined ||
      generateItemQuery.data === undefined ||
      generateCharacterQuery.fetchStatus !== "idle" ||
      generateItemQuery.fetchStatus !== "idle"
    )
      return
    switch (action) {
      case "discard":
        break
      case "save":
        setSavedCards(
          savedCards.set(
            (savedCards.keySeq().max() ?? 0) + 1,
            generationMode.type === "character"
              ? { type: "character", data: generateCharacterQuery.data }
              : { type: "item", data: generateItemQuery.data }
          )
        )
        break
    }
    switch (generationMode.type) {
      case "character":
        generateCharacterQuery.refetch()
        break
      case "item":
        generateItemQuery.refetch()
        break
    }
  }

  return (
    <RootLayout>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        limit={1}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        theme="colored"
      />
      <div className="flex flex-col items-center py-4">
        <h1 className="mt-5 p-5 text-center font-serif text-5xl">
          ANCESTRY ORIGIN
        </h1>

        <div className="my-5 grid w-[450px] min-w-fit grid-cols-2 rounded-2xl border-2 border-nightingale text-center text-lg">
          <button
            className={`m-1 rounded-2xl p-1 transition-colors ${
              actionMode === "generate" ? "bg-vanilla" : ""
            }`}
            onClick={() => setActionMode("generate")}
          >
            Generate
          </button>
          <button
            className={`m-1 rounded-2xl p-1 transition-colors ${
              actionMode === "manage" ? "bg-vanilla" : ""
            }`}
            onClick={() => setActionMode("manage")}
          >
            {`(${savedCards.size}) Manage`}
          </button>
        </div>

        <div className="grid w-full place-content-center px-2">
          {actionMode === "generate" ? (
            <div className="flex h-full w-[450px] flex-col items-center justify-center">
              <div className="my-5 grid w-[450px] min-w-fit grid-cols-2 rounded-2xl border-2 border-nightingale text-center text-lg">
                <button
                  className={`m-1 rounded-2xl p-1 transition-colors ${
                    generationMode.type === "character" ? "bg-vanilla" : ""
                  }`}
                  onClick={() =>
                    setGenerationMode({
                      type: "character",
                    })
                  }
                >
                  Character
                </button>
                <button
                  className={`m-1 rounded-2xl p-1 transition-colors ${
                    generationMode.type === "item" ? "bg-vanilla" : ""
                  }`}
                  onClick={() =>
                    setGenerationMode({
                      type: "item",
                    })
                  }
                >
                  Item
                </button>
              </div>
              {generationMode.type === "character" &&
              generateCharacterQuery.data !== undefined ? (
                <CharacterCardGen data={generateCharacterQuery.data} />
              ) : generationMode.type === "item" &&
                generateItemQuery.data !== undefined ? (
                <ItemCardGen data={generateItemQuery.data} />
              ) : (
                <></>
              )}
              <div className={`flex w-full flex-row justify-center gap-5 py-4`}>
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
            </div>
          ) : (
            <div className="flex max-w-7xl flex-col items-center justify-start gap-5 lg:w-[1024px]">
              <div className="flex w-full flex-col-reverse lg:flex-row lg:flex-nowrap lg:justify-end">
                <div className="grid w-auto grow place-content-center">
                  <ul
                    ref={animateRef}
                    className="col-span-2 flex flex-row flex-wrap items-start justify-center gap-4"
                  >
                    {savedCards
                      .entrySeq()
                      .map(([key, val]) => (
                        <li className={`relative transition-opacity`} key={key}>
                          <div
                            className={`absolute z-50 flex h-full w-full items-center justify-center rounded-lg border-8 border-rosewood transition-colors ${
                              selectedCardId !== undefined &&
                              selectedCardId === key
                                ? "border-opacity-100"
                                : "border-opacity-0"
                            }`}
                          >
                            <button
                              className={`h-full w-full`}
                              style={{
                                borderColor: "#5C0404",
                              }}
                              onClick={() => setSelectedCardId(key)}
                            />
                          </div>
                          {val.type === "character" ? (
                            <CharacterCardSmall data={val.data} />
                          ) : (
                            <ItemCardSmall data={val.data} />
                          )}
                        </li>
                      ))
                      .toArray()}
                  </ul>
                </div>
                <div className="flex flex-col items-center justify-start">
                  <div className="m-3 w-[350px]">
                    {selectedCard === undefined ? (
                      <></>
                    ) : (
                      <div className="flex h-full min-h-fit flex-col justify-between border-4 border-vanilla bg-[#E2D8CD]">
                        <h2 className="bg-vanilla p-3 text-center font-serif text-3xl">
                          INFORMATION
                        </h2>
                        <div className="grow p-3">
                          {selectedCard.type === "character" ? (
                            <div>
                              <h3 className="py-1 text-xl">
                                <strong>{`${selectedCard.data.firstName} ${selectedCard.data.lastName}`}</strong>{" "}
                              </h3>
                              <h4 className="py-1">{`${selectedCard.data.gender} ${selectedCard.data.race} ${selectedCard.data.class}`}</h4>
                              <ul className="list-inside list-disc text-left">
                                {[
                                  ["Background", selectedCard.data.background],
                                  ["Age", selectedCard.data.age.toString()],
                                  ...selectedCard.data.details.map(
                                    ({ detail, description }) => [
                                      detail,
                                      description,
                                    ]
                                  ),
                                ].map(([key, val]) => (
                                  <li key={key}>
                                    <strong>{capitalize(key)}</strong>: {val}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div>
                              <h3 className="py-1 text-xl">
                                <strong>{`${selectedCard.data.name}`}</strong>{" "}
                              </h3>
                              <h4 className="py-1">{`${capitalize(
                                selectedCard.data.style
                              )} ${capitalize(selectedCard.data.kind)} (${
                                selectedCard.data.category
                              })`}</h4>
                              <p>{selectedCard.data.description}</p>
                              <ul className="list-inside list-disc text-left">
                                {[
                                  ["History", selectedCard.data.history],
                                  ["Property", selectedCard.data.property],
                                  ["Quirk", selectedCard.data.quirk],
                                ].map(([key, val]) => (
                                  <li key={key}>
                                    <strong>{capitalize(key)}</strong>: {val}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 place-items-center p-3">
                          <button
                            className="col-span-2 w-4/5 rounded-lg border-2 border-nightingale bg-vanilla p-2 font-serif"
                            onClick={() => {
                              if (selectedCardId === undefined) return
                              setSavedCards(savedCards.delete(selectedCardId))
                              setSelectedCardId(undefined)
                            }}
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                <div
                  className="col-span-2 flex place-content-center p-3"
                  style={{
                    boxSizing: "border-box",
                    background: "#C8B6A6",
                    border: "5px solid #5E4529",
                    borderRadius: "20px",
                  }}
                >
                  <a
                    href={
                      savedCards.size > 0
                        ? `data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(
                              savedCards
                                .valueSeq()
                                .groupBy((data) => data.type)
                                .map((data) =>
                                  data.map((d) => ({
                                    ...d.data,
                                    type: undefined,
                                    imagePath: undefined,
                                  }))
                                )
                                .toObject(),
                              null,
                              2
                            )
                          )}`
                        : undefined
                    }
                    download={"saved-characters.json"}
                    className={`font-serif text-4xl ${
                      savedCards.size > 0 ? "" : "cursor-default opacity-50"
                    }`}
                    style={{
                      textAlign: "center",
                      color: "#362715",
                    }}
                  >
                    Export
                  </a>
                </div>
                <div
                  className="col-span-3 grid place-content-center p-3"
                  style={{
                    boxSizing: "border-box",
                    background: "#C8B6A6",
                    border: "5px solid #5E4529",
                    borderRadius: "20px",
                  }}
                >
                  <button
                    onClick={() => {
                      switch (authStatus) {
                        case "unauthenticated":
                          signIn()
                          break
                        case "authenticated":
                          if (savedCards.size === 0) return
                          saveToAccountMutation.mutate({
                            user: session.user?.email!,
                            characters: savedCards
                              .valueSeq()
                              .flatMap((card) =>
                                card.type === "character"
                                  ? [
                                      {
                                        ...card.data,
                                      },
                                    ]
                                  : []
                              )
                              .toArray(),
                            items: savedCards
                              .valueSeq()
                              .flatMap((card) =>
                                card.type === "item"
                                  ? [
                                      {
                                        ...card.data,
                                      },
                                    ]
                                  : []
                              )
                              .toArray(),
                          })
                          break
                      }
                    }}
                    className="font-serif text-3xl"
                    style={{
                      textAlign: "center",
                      color: "#362715",
                    }}
                  >
                    {authStatus === "authenticated"
                      ? "Save to account"
                      : "Sign in to save ➡"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  )
}

export default Generator
