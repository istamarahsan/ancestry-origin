import { type CreateNextContextOptions } from "@trpc/server/adapters/next"

type CreateContextOptions = {}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return { db: prisma }
}

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  return createInnerTRPCContext({})
}

import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"
import { prisma } from "../db"

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
