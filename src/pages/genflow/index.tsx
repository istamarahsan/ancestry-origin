import { useState } from "react"
import { CharDetails } from "../models"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { Map, Range } from "immutable"

type CharCardProps = {
  characterDetails: CharDetails
  onSelect: () => void
}

const CharCard = ({ characterDetails, onSelect }: CharCardProps) => {
  return (
    <div
      className="max-w-sm cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
      onClick={onSelect}
    >
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {characterDetails.name}
      </h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {characterDetails.description}
      </p>
    </div>
  )
}

const GeneratorFlow = () => {
  const initialHand: Map<number, CharDetails> = Map()
  const initialDeck: Map<number, CharDetails> = Map()

  const [hand, setHand] = useState(initialHand)
  const [deck, setDeck] = useState(initialDeck)
  const [parent, _] = useAutoAnimate()

  function handleKeep(deckIdx: number) {
    return () => {
      setDeck((deck) =>
        deck.set(deckIdx, hand.get(deckIdx)!)
      )
      setHand((hand) => hand.remove(deckIdx))
    }
  }

  function handleGenerate() {
    setHand((hand) =>
      hand.merge(
        Map(
          Range(0, 5).map((i) => {
            const id = (hand.keySeq().concat(deck.keySeq()).max() || 0) + 1 + i
            return [
              id,
              {
                name: `char ${id}`,
                description: "wahoo" + "o".repeat(id),
              },
            ]
          })
        )
      )
    )
  }

  function handleDiscard() {
    setHand(Map())
  }

  function handleReset() {
    setDeck(Map())
    setHand(Map())
  }

  return (
    <div className="m-20 grid grid-cols-3 place-content-between">
      <div className="mx-5 flex-col space-y-5" ref={parent}>
        {deck
          .entrySeq()
          .toArray()
          .map(([id, char]) => (
            <CharCard
              key={id}
              characterDetails={char}
              onSelect={() => {}}
            ></CharCard>
          ))}
      </div>
      <div className="mx-5 flex-col space-y-5" ref={parent}>
        {hand
          .entrySeq()
          .toArray()
          .map(([id, char]) => (
            <CharCard
              key={id}
              characterDetails={char}
              onSelect={handleKeep(id)}
            ></CharCard>
          ))}
      </div>
      <div className="grid shrink grid-cols-1 place-content-start">
        <div className="flex place-content-start">
          <button className="p-5" onClick={handleGenerate}>
            Generate
          </button>
          <button className="p-5" onClick={handleDiscard}>
            Discard
          </button>
          <button className="p-5" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default GeneratorFlow
