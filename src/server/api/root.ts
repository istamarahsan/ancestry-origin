import { createTRPCRouter } from "~/server/api/trpc"
import { generateRouter } from "~/server/api/routers/generate"

export const appRouter = createTRPCRouter({
  generate: generateRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
