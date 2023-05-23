import { NextPage } from "next"

const CharacterNameGenerator: NextPage = () => {
  return (
    <main className="grid min-h-screen grid-cols-3 flex-col items-center justify-center">
      <div className="col-span-1 flex flex-col place-content-center">
        <button className="font-serif">GENERATE NAME</button>
        <div className="flex flex-col">
          <button className="font-serif">RANDOM</button>
          <button className="font-serif">Male</button>
          <button className="font-serif">Female</button>
        </div>
      </div>
      <div className="col-span-2 flex flex-col place-items-center">
        <h1 className="font-serif">CHARACTER NAME GENERATOR</h1>
        <div className="flex flex-col">
          <div>
            <h4 className="font-serif">RICHARD BERGFALKS</h4>
            <h5 className="font-serif">FIRST NAME MEANS: BRAVE POWER</h5>
          </div>
          <div>
            <h4 className="font-serif">HADWIG EKSTEING</h4>
            <h5 className="font-serif">FIRST NAME MEANS: FIGHT, DUEL</h5>
          </div>
          <div>
            <h4 className="font-serif">ELLANHER BUSHE</h4>
            <h5 className="font-serif">FIRST NAME MEANS: STRENGTH, POWER</h5>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CharacterNameGenerator
