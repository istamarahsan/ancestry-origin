import { createTRPCRouter } from "~/server/api/trpc"
import { generateRouter } from "~/server/api/routers/generate"
import { savedRouter } from "./routers/saved"

export const appRouter = createTRPCRouter({
  generate: generateRouter,
  saved: savedRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
