import { randomInt } from "crypto"
import { Map, Set } from "immutable"
import lodash from "lodash"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

type CharacterDetail = {
  detail: string
  description: string
}

type CharacterBasicData = {
  firstName: string
  lastName: string
  gender: string
  race: string
  class: string
  background: string
  age: number
}

export type CharacterData = {
  details: CharacterDetail[]
} & CharacterBasicData

const racesWithImages: Set<string> = Set([
  "Dragonborn",
  "Dwarf",
  "Elf",
  "Gnome",
  "Half-Elf",
  "Half-Orc",
  "Halfling",
  "Human",
  "Tiefling",
])

const detailsStatic: CharacterDetail[] = [
  { detail: "Occupation", description: "Street urchin" },
  {
    detail: "Likes",
    description: "Reading ancient tomes and unraveling mysteries",
  },
  { detail: "Dislikes", description: "Crowded places and loud noises" },
  {
    detail: "Backstory",
    description:
      "Orphaned at a young age, they survived by their wits on the city streets.",
  },
  {
    detail: "Hopes",
    description:
      "To uncover the truth behind their mysterious birth and find a place to call home.",
  },
  {
    detail: "Fears",
    description: "Being abandoned or betrayed by those they trust.",
  },
  { detail: "Occupation", description: "Skilled blacksmith" },
  {
    detail: "Trait",
    description:
      "I have a soft spot for animals and always try to help injured creatures.",
  },
  { detail: "Likes", description: "Forging intricate weapons and armor" },
  { detail: "Dislikes", description: "Incompetence and sloppy craftsmanship" },
  {
    detail: "Backstory",
    description:
      "Apprenticed under a renowned master blacksmith and inherited their forge.",
  },
  {
    detail: "Hopes",
    description:
      "To create a legendary weapon and be recognized as a master in their craft.",
  },
  {
    detail: "Fears",
    description:
      "Losing their hands or the ability to work due to an accident.",
  },
  { detail: "Occupation", description: "Wandering minstrel" },
  {
    detail: "Trait",
    description: "I can charm my way out of almost any situation.",
  },
  {
    detail: "Likes",
    description:
      "Performing for large audiences and collecting unique instruments",
  },
  { detail: "Dislikes", description: "Boredom and routine" },
  {
    detail: "Backstory",
    description:
      "Left their noble family to pursue a life of adventure and music.",
  },
  {
    detail: "Hopes",
    description:
      "To compose a renowned ballad that will be sung for generations to come.",
  },
  {
    detail: "Fears",
    description: "Being forgotten and leaving no lasting impact on the world.",
  },
  { detail: "Special Term", description: "Shadowfell" },
  { detail: "Special Term", description: "Arcane Conflux" },
  { detail: "Special Term", description: "Celestial Accord" },
  { detail: "Special Term", description: "Eldritch Nexus" },
  { detail: "Special Term", description: "Divine Retribution" },
  {
    detail: "Mannerism",
    description: "Always taps their fingers when thinking",
  },
  {
    detail: "Mannerism",
    description: "Constantly twirls a lock of hair around their finger",
  },
  {
    detail: "Mannerism",
    description: "Often clears their throat before speaking",
  },
  {
    detail: "Mannerism",
    description:
      "Laughs softly at their own jokes, even if no one else finds them funny",
  },
  {
    detail: "Mannerism",
    description: "Has a habit of humming or whistling while walking",
  },
  {
    detail: "Flaw",
    description:
      "Impulsive and tends to act without considering the consequences",
  },
  {
    detail: "Flaw",
    description:
      "Struggles with trust issues and finds it hard to rely on others",
  },
  {
    detail: "Flaw",
    description:
      "Has a crippling fear of water due to a traumatic childhood incident",
  },
  {
    detail: "Flaw",
    description: "Easily swayed by flattery and prone to being manipulated",
  },
  {
    detail: "Flaw",
    description:
      "Tends to be overly competitive, even in non-competitive situations",
  },
  {
    detail: "Secret",
    description: "They are a spy working undercover for a rival faction",
  },
  {
    detail: "Secret",
    description:
      "They are secretly in love with their best friend's significant other",
  },
  {
    detail: "Secret",
    description:
      "They are haunted by a dark entity from their past that they cannot shake off",
  },
  {
    detail: "Secret",
    description:
      "They were responsible for a tragic event in their hometown but managed to keep it hidden",
  },
  {
    detail: "Secret",
    description:
      "They possess a powerful artifact that grants them an unusual ability, but they must keep it hidden at all costs",
  },
].filter((d) => d.detail !== "Special Term")

const charDataStatic: CharacterBasicData[] = [
  {
    firstName: "Kael",
    lastName: "Stoneforge",
    gender: "Male",
    race: "Dwarf",
    class: "Cleric",
    background: "Acolyte",
    age: 75,
  },
  {
    firstName: "Elara",
    lastName: "Moonshadow",
    gender: "Female",
    race: "Half-Elf",
    class: "Wizard",
    background: "Sage",
    age: 52,
  },
  {
    firstName: "Finn",
    lastName: "Hawthorne",
    gender: "Male",
    race: "Halfling",
    class: "Rogue",
    background: "Charlatan",
    age: 30,
  },
  {
    firstName: "Seraphina",
    lastName: "Stormwind",
    gender: "Female",
    race: "Human",
    class: "Paladin",
    background: "Noble",
    age: 27,
  },
  {
    firstName: "Orin",
    lastName: "Ravenwood",
    gender: "Male",
    race: "Wood Elf",
    class: "Ranger",
    background: "Outlander",
    age: 113,
  },
  {
    firstName: "Lilith",
    lastName: "Darkthorn",
    gender: "Female",
    race: "Tiefling",
    class: "Warlock",
    background: "Urchin",
    age: 35,
  },
  {
    firstName: "Cyrus",
    lastName: "Bloodfang",
    gender: "Male",
    race: "Dragonborn",
    class: "Fighter",
    background: "Mercenary",
    age: 42,
  },
  {
    firstName: "Evelyn",
    lastName: "Silverheart",
    gender: "Female",
    race: "High Elf",
    class: "Bard",
    background: "Entertainer",
    age: 87,
  },
  {
    firstName: "Garrick",
    lastName: "Stonebrook",
    gender: "Male",
    race: "Human",
    class: "Fighter",
    background: "Knight",
    age: 48,
  },
  {
    firstName: "Amara",
    lastName: "Duskborn",
    gender: "Female",
    race: "Drow",
    class: "Rogue",
    background: "Criminal",
    age: 134,
  },
  {
    firstName: "Thorin",
    lastName: "Boulderbreaker",
    gender: "Male",
    race: "Dwarf",
    class: "Barbarian",
    background: "Folk Hero",
    age: 56,
  },
  {
    firstName: "Sylvia",
    lastName: "Rainsong",
    gender: "Female",
    race: "Half-Elf",
    class: "Druid",
    background: "Hermit",
    age: 41,
  },
  {
    firstName: "Gideon",
    lastName: "Shadowblade",
    gender: "Male",
    race: "Tiefling",
    class: "Warlock",
    background: "Sage",
    age: 64,
  },
  {
    firstName: "Lyra",
    lastName: "Brightwood",
    gender: "Female",
    race: "Wood Elf",
    class: "Ranger",
    background: "Farmer",
    age: 183,
  },
  {
    firstName: "Leoric",
    lastName: "Grimshaw",
    gender: "Male",
    race: "Human",
    class: "Paladin",
    background: "Acolyte",
    age: 32,
  },
  {
    firstName: "Morgana",
    lastName: "Bloodthorn",
    gender: "Female",
    race: "Half-Orc",
    class: "Sorcerer",
    background: "Criminal",
    age: 26,
  },
  {
    firstName: "Luna",
    lastName: "Whisperwind",
    gender: "Female",
    race: "Aasimar",
    class: "Sorcerer",
    background: "Haunted One",
    age: 31,
  },
  {
    firstName: "Alistair",
    lastName: "Ironheart",
    gender: "Male",
    race: "Dwarf",
    class: "Paladin",
    background: "Soldier",
    age: 64,
  },
  {
    firstName: "Celeste",
    lastName: "Firebrand",
    gender: "Female",
    race: "Tiefling",
    class: "Sorcerer",
    background: "Noble",
    age: 22,
  },
  {
    firstName: "Roran",
    lastName: "Thundershield",
    gender: "Male",
    race: "Half-Orc",
    class: "Barbarian",
    background: "Outlander",
    age: 32,
  },
  {
    firstName: "Elysia",
    lastName: "Mistral",
    gender: "Female",
    race: "Elf",
    class: "Wizard",
    background: "Sage",
    age: 183,
  },
  {
    firstName: "Vance",
    lastName: "Winterborne",
    gender: "Male",
    race: "Human",
    class: "Bard",
    background: "Charlatan",
    age: 29,
  },
  {
    firstName: "Lorelei",
    lastName: "Moonbrook",
    gender: "Female",
    race: "Half-Elf",
    class: "Cleric",
    background: "Acolyte",
    age: 47,
  },
  {
    firstName: "Kieran",
    lastName: "Blackthorn",
    gender: "Male",
    race: "Human",
    class: "Fighter",
    background: "Knight",
    age: 33,
  },
].filter((c) => racesWithImages.contains(c.race))

const detailsByLabel: Map<string, CharacterDetail[]> = detailsStatic.reduce<
  Map<string, CharacterDetail[]>
>((map, entry) => {
  return map.set(entry.detail, [...map.get(entry.detail, []), entry])
}, Map())

export const generateRouter = createTRPCRouter({
  character: publicProcedure.query(async ({}) => {
    const details = lodash
      .sampleSize(detailsByLabel.valueSeq().toArray(), randomInt(4, 6))
      .map((details) => lodash.sample(details)!)
    const genResult: CharacterData = {
      ...lodash.sample(charDataStatic)!,
      details: details,
    }
    return genResult
  }),
})
