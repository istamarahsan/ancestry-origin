import { NextPage } from "next"
import { signIn, signOut, useSession } from "next-auth/react"
import RootLayout from "~/components/layout"
import Image from "next/image"
import { Disclosure, Transition } from "@headlessui/react"
import { api } from "~/utils/api"
import CharacterCardSmall from "~/components/CharacterCardSmall"
import ItemCardSmall from "~/components/ItemCardSmall"
import { List } from "immutable"
import { SavedData } from "~/server/api/routers/saved"

const Me: NextPage = () => {
  const { data: session, status: authStatus } = useSession()
  const getSavedCharactersQuery = api.saved.getSavedCharactersForUser.useQuery(
    session?.user?.email ?? ""
  )
  const getSavedItemsQuery = api.saved.getSavedItemsForUser.useQuery(
    session?.user?.email ?? ""
  )
  const savedCards =
    getSavedCharactersQuery.data !== undefined &&
    getSavedItemsQuery.data !== undefined
      ? List<SavedData>([
          ...getSavedCharactersQuery.data.map<SavedData>((data) => ({
            type: "character",
            data: data,
          })),
          ...getSavedItemsQuery.data.map<SavedData>((data) => ({
            type: "item",
            data: data,
          })),
        ])
      : List([])
  if (authStatus === "loading") {
    return (
      <RootLayout>
        <></>
      </RootLayout>
    )
  }
  if (authStatus === "unauthenticated") {
    signIn("google")
  }

  return (
    <RootLayout>
      <div className="flex w-full flex-col items-center justify-start">
        <div className="flex flex-col items-center justify-start gap-5 py-10">
          <Image
            className="rounded-full"
            width={100}
            height={100}
            src={session?.user?.image ?? ""}
            alt="profile image"
          />
          <h1 className="font-sans text-xl">{session?.user?.email ?? ""}</h1>
          <div className="flex flex-row items-center justify-center gap-5">
            <a href="/" className="p-1 hover:text-blue-500 hover:underline">
              Back
            </a>

            <button
              className="p-1 hover:text-blue-500 hover:underline"
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                })
              }
            >
              Sign Out
            </button>
          </div>
          <a
            href={
              savedCards.size > 0
                ? `data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(
                      savedCards
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
        <div className="grid w-full max-w-6xl grid-cols-2 place-content-center px-10">
          <div className="col-span-2">
            <Disclosure as="div" className="py-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>Characters</span>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-300 ease-out"
                    enterFrom="transform opacity-0 -translate-x-10"
                    enterTo="transform opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform opacity-100"
                    leaveTo="transform opacity-0 translate-x-10"
                  >
                    <Disclosure.Panel className="px-4 pb-2 pt-4">
                      {getSavedCharactersQuery.status === "success" ? (
                        <ul className="flex flex-row flex-wrap justify-start">
                          {getSavedCharactersQuery.data.length > 0 ? (
                            getSavedCharactersQuery.data.map((character, i) => (
                              <li className="p-2" key={i}>
                                <CharacterCardSmall data={character} />
                              </li>
                            ))
                          ) : (
                            <p>No saved characters</p>
                          )}
                        </ul>
                      ) : (
                        <></>
                      )}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
            <Disclosure as="div" className="py-2">
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>Items</span>
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-300 ease-out"
                    enterFrom="transform opacity-0 -translate-x-10"
                    enterTo="transform opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform opacity-100"
                    leaveTo="transform opacity-0 translate-x-10"
                  >
                    <Disclosure.Panel className="px-4 pb-2 pt-4">
                      {getSavedItemsQuery.status === "success" ? (
                        <ul className="flex flex-row flex-wrap justify-start">
                          {getSavedItemsQuery.data.length > 0 ? (
                            getSavedItemsQuery.data.map((item, i) => (
                              <li className="p-2" key={i}>
                                <ItemCardSmall data={item} />
                              </li>
                            ))
                          ) : (
                            <p>No saved items</p>
                          )}
                        </ul>
                      ) : (
                        <></>
                      )}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}

export default Me
