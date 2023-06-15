import { CharacterData } from "~/pages/charactergenerator"

type CharacterCardSmallProps = {
  tilt: "left" | "right" | "none"
  data: CharacterData
}

export default function CharacterCardSmall({
  tilt,
  data,
}: CharacterCardSmallProps) {
  return (
    <div
      className="z-0 flex flex-col justify-start px-5 py-7 align-middle transition-transform"
      style={{
        width: "200px",
        height: "300px",
        boxSizing: "border-box",
        background: "#C8B6A6",
        border: "5px solid #5E4529",
        borderRadius: "20px",
        transform: `translateX(${
          tilt === "left" ? "5rem" : tilt === "right" ? "-5rem" : "0rem"
        }) rotate(${tilt === "left" ? 15 : tilt === "right" ? -15 : 0}deg)`,
      }}
    >
      <img
        src={data.imagePath}
        width={400}
        height={400}
        alt="character portrait"
        className="mb-1 w-full rounded-lg border-4"
        style={{
          width: "100%",
          height: "40%",
          borderColor: "#5C0404",
          objectFit: "cover",
        }}
      />
      <div
        className="mt-1 flex flex-grow flex-col justify-start rounded-lg border-4 py-3 align-middle"
        style={{ borderColor: "#5C0404" }}
      >
        <h2 className="text-1xl py-1 text-center">
          {`${data.firstName}${data.lastName ? ` ${data.lastName}` : ""}`}
        </h2>
        <h3 className="px-2 text-center text-sm">
          {`${data.race} ${data.class}`}
        </h3>
      </div>
    </div>
  )
}
