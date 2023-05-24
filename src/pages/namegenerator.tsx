import { NextPage } from "next"
import Image from "next/image"
import { RadioGroup } from "@headlessui/react"
import { useState } from "react"

type GenderCheckBoxProps = {
  checked: boolean
  label: string
}

const GenderCheckBox = ({ checked, label }: GenderCheckBoxProps) => {
  return (
    <button
      className="m-1 h-full w-full p-1 text-center font-serif"
      style={{
        boxSizing: "border-box",
        background: "#E2D8CD",
        border: "5px solid #5E4529",
        borderRadius: "20px",
        opacity: checked ? 1 : 0.5,
      }}
    >
      {label}
    </button>
  )
}

type GenerationOptionGender = "random" | "male" | "female"

type GenerationOptions = {
  gender: GenerationOptionGender
}

type GenerationResult = {
  names?: [
    [string, string, string],
    [string, string, string],
    [string, string, string]
  ]
}

function getRandomIntegerInRange(a: number, b: number): number {
  // Swap values if a is greater than b
  if (a > b) {
    ;[a, b] = [b, a]
  }

  // Calculate the range (inclusive of both a and b)
  const range = b - a + 1

  // Generate a random number within the range
  const random = Math.floor(Math.random() * range)

  // Add the random number to the minimum value (a) to get the final result
  const result = a + random

  return result
}

const namePossibilities: string[] = ["Alfred", "Jason"]
const meaningPossibilities: string[] = [
  "brave",
  "power",
  "fight",
  "duel",
  "strength",
]

function getRandomName(): string {
  return (
    (namePossibilities[
      getRandomIntegerInRange(0, namePossibilities.length - 1)
    ] ?? "") +
      " " +
      namePossibilities[
        getRandomIntegerInRange(0, namePossibilities.length - 1)
      ] ?? ""
  )
}

function getRandomMeaning(): string {
  return (
    meaningPossibilities[
      getRandomIntegerInRange(0, meaningPossibilities.length - 1)
    ] ?? ""
  )
}

function getRandomResult(): [string, string, string] {
  return [getRandomName(), getRandomMeaning(), getRandomMeaning()]
}

function getRandomGen(): [
  [string, string, string],
  [string, string, string],
  [string, string, string]
] {
  return [getRandomResult(), getRandomResult(), getRandomResult()]
}

const CharacterNameGenerator: NextPage = () => {
  const [genOptions, setGenOptions] = useState<GenerationOptions>({
    gender: "random",
  })

  const [genResult, setGenResult] = useState<GenerationResult>({})

  return (
    <main
      className="flex items-center justify-center"
      style={{
        background: "#F1DEC9",
        backgroundImage: "url(/noise-texture.png)",
      }}
    >
      <div
        className="my-4 grid min-h-screen grid-cols-3 items-center justify-center gap-5 px-3"
        style={{
          maxWidth: "900px",
        }}
      >
        <div className="col-span-1 flex flex-col place-content-center gap-5">
          <div
            style={{
              boxSizing: "border-box",
              background: "#C8B6A6",
              border: "5px solid #5E4529",
              borderRadius: "20px",
            }}
          >
            <Image
              src={"/german.png"}
              width={414}
              height={432}
              alt="character portrait"
              className="w-full pt-10"
              style={{}}
            />
          </div>
          <button
            className="px-1 py-2 font-serif"
            style={{
              boxSizing: "border-box",
              background: "#C8B6A6",
              border: "5px solid #5E4529",
              borderRadius: "20px",
            }}
            onClick={() =>
              setGenResult({
                ...genResult,
                names: getRandomGen(),
              })
            }
          >
            GENERATE NAME
          </button>
          <RadioGroup
            value={genOptions.gender}
            onChange={(value) =>
              setGenOptions({
                ...genOptions,
                gender: value,
              })
            }
            className="flex flex-col px-8 py-3"
            style={{
              boxSizing: "border-box",
              background: "#C8B6A6",
              border: "5px solid #5E4529",
              borderRadius: "20px",
            }}
          >
            <RadioGroup.Option value="random">
              {({ checked }) => (
                <GenderCheckBox checked={checked} label="RANDOM" />
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value="male">
              {({ checked }) => (
                <GenderCheckBox checked={checked} label="MALE" />
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value="female">
              {({ checked }) => (
                <GenderCheckBox checked={checked} label="FEMALE" />
              )}
            </RadioGroup.Option>
          </RadioGroup>
        </div>
        <div className="col-span-2 flex flex-col place-items-center">
          <h1
            className="text-center font-serif"
            style={{
              fontSize: "85px",
            }}
          >
            CHARACTER NAME GENERATOR
          </h1>
          <div className="flex w-full flex-col px-10">
            <div
              className="my-2 p-3"
              style={{
                boxSizing: "border-box",
                background: "#C8B6A6",
                border: "5px solid #5E4529",
                borderRadius: "20px",
              }}
            >
              <h4 className="font-serif" style={{ fontSize: "48px" }}>
                {genResult.names?.[0][0] ?? "‎"}
              </h4>
              <h5 className="font-serif">
                FIRST NAME MEANS:{" "}
                {`${genResult.names?.[0][1] ?? ""}, ${
                  genResult.names?.[0][2] ?? ""
                }`}
              </h5>
            </div>
            <div
              className="my-2 p-3"
              style={{
                boxSizing: "border-box",
                background: "#C8B6A6",
                border: "5px solid #5E4529",
                borderRadius: "20px",
              }}
            >
              <h4 className="font-serif" style={{ fontSize: "48px" }}>
                {genResult.names?.[1][0] ?? "‎"}
              </h4>
              <h5 className="font-serif">
                FIRST NAME MEANS:{" "}
                {`${genResult.names?.[1][1] ?? ""}, ${
                  genResult.names?.[1][2] ?? ""
                }`}
              </h5>
            </div>
            <div
              className="my-2 p-3"
              style={{
                boxSizing: "border-box",
                background: "#C8B6A6",
                border: "5px solid #5E4529",
                borderRadius: "20px",
              }}
            >
              <h4 className="font-serif" style={{ fontSize: "48px" }}>
                {genResult.names?.[2][0] ?? "‎"}
              </h4>
              <h5 className="font-serif">
                FIRST NAME MEANS:{" "}
                {`${genResult.names?.[2][1] ?? ""}, ${
                  genResult.names?.[2][2] ?? ""
                }`}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CharacterNameGenerator
