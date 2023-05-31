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
        height: "260px",
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
        width={414}
        height={432}
        alt="character portrait"
        className="mb-1 w-full rounded-lg border-4"
        style={{
          borderColor: "#5C0404",
        }}
      />
      <div
        className="mt-1 flex flex-col justify-start rounded-lg border-4 py-3 align-middle"
        style={{ borderColor: "#5C0404" }}
      >
        <h2 className="text-1xl py-1 text-center">
          {data.firstName}
          {data.lastName ? ` ${data.lastName}` : ""}
        </h2>
        <h3 className="px-2 text-center text-sm">
          {`${data.race} ${data.class}`}
        </h3>
        {/* <div>
          <h3 className="px-2 text-center text-sm">
            {`${data.race} - ${data.class} - ${data.background}`}
          </h3>
          <h3 className="px-2 text-center text-sm">
            {`${data.subrace ? `${data.subrace} - ` : ""}${
              data.gender
            } - ${data.ageYears.toString()} years`}
          </h3>
        </div> */}
        {/* <ul className="flex flex-col items-start justify-start gap-1 px-2 py-1 font-serifSub">
          {data.details.map((d) => (
            <li key={d.detail} className="text-md">
              <strong>{d.detail}</strong> {d.description}
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  )
}
