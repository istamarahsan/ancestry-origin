import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { CharacterData, ItemData } from "./generate"
import { Prisma } from "@prisma/client"

export type SavedData =
  | { type: "character"; data: CharacterData }
  | { type: "item"; data: ItemData }

const characterValidation = z.object({
  imagePath: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  race: z.string(),
  class: z.string(),
  background: z.string(),
  age: z.number(),
  details: z.array(
    z.object({
      detail: z.string(),
      description: z.string(),
    })
  ),
})

const itemValidation = z.object({
  imagePath: z.string(),
  name: z.string(),
  kind: z.string(),
  category: z.enum(["weapon", "armor", "tool", "trinket", "consumable"]),
  style: z.string(),
  description: z.string(),
  history: z.string(),
  property: z.string(),
  quirk: z.string(),
})

type CharValidated = z.infer<typeof characterValidation>
type ItemValidated = z.infer<typeof itemValidation>

export const savedRouter = createTRPCRouter({
  getForUser: publicProcedure
    .input(z.string().email())
    .query<SavedData[]>(({ ctx, input }) => {
      return []
    }),
  saveToUser: publicProcedure
    .input(
      z.object({
        user: z.string().email(),
        characters: z.array(characterValidation),
        items: z.array(itemValidation),
      })
    )
    .mutation<boolean>(async ({ ctx, input }) => {
      if (input.items.length > 0) {
        const { _max } = await ctx.db.saved_item.aggregate({
          _max: {
            count: true,
          },
        })
        const { count: upperCount } = _max
        const startingCount = upperCount !== null ? upperCount + 1 : 0
        const labelled: [ItemValidated, number][] = input.items.map((el, i) => [
          el,
          i + startingCount,
        ])
        await ctx.db.saved_item.createMany({
          data: labelled.map<Prisma.saved_itemCreateManyInput>(([el, i]) => ({
            owner_email: input.user,
            count: startingCount + i,
            name: el.name,
            kind: el.kind,
            category: el.category,
            style: el.style,
            description: el.description,
            history: el.history,
            property: el.property,
            quirk: el.quirk,
            image_id: el.imagePath,
          })),
        })
      }
      if (input.characters.length > 0) {
        const { _max } = await ctx.db.saved_character.aggregate({
          _max: {
            count: true,
          },
        })
        const { count: upperCount } = _max
        const startingCount = upperCount !== null ? upperCount + 1 : 0
        const labelled: [CharValidated, number][] = input.characters.map(
          (el, i) => [el, i + startingCount]
        )
        await ctx.db.saved_character.createMany({
          data: labelled.map<Prisma.saved_characterCreateManyInput>(
            ([el, count]) => ({
              owner_email: input.user,
              count: count,
              first_name: el.firstName,
              last_name: el.lastName,
              image_id: el.imagePath,
              race: el.race,
              class: el.class,
              background: el.background,
              gender: el.gender,
              age: el.age,
            })
          ),
        })
        for (const [character, count] of labelled) {
          await ctx.db.saved_character_detail.createMany({
            data: character.details.map<Prisma.saved_character_detailCreateManyInput>(
              ({ detail, description }) => ({
                owner_email: input.user,
                owner_character_count: count,
                detail: detail,
                description: description,
              })
            ),
          })
        }
      }
      return true
    }),
})
