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
  imagePath: string
  details: CharacterDetail[]
} & CharacterBasicData

type ItemBasicData = {
  name: string
  kind: string
  category: "weapon" | "armor" | "trinket" | "tool" | "consumable"
  style: string
  description: string
}

export type ItemData = {
  imagePath: string
  history: string
  property: string
  quirk: string
} & ItemBasicData

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

const itemsBasic: ItemBasicData[] = [
  {
    name: "Dwarven Battle-Axe",
    kind: "axe",
    category: "weapon",
    style: "dwarf",
    description:
      "A majestic dwarven battle-axe adorned with intricate engravings and forged from the finest adamantium. It is said to be wielded by the rightful ruler of the Dwarven Kingdoms, granting unrivaled strength in battle.",
  },
  {
    name: "Silk Cloak of Shadows",
    kind: "cloak",
    category: "armor",
    style: "eastern",
    description:
      "A shimmering black silk cloak embroidered with golden thread, crafted by the secretive assassins of the Far East. When worn, it grants the ability to blend into shadows, becoming nearly invisible to the untrained eye.",
  },
  {
    name: "Elemental Fire Pendant",
    kind: "pendant",
    category: "trinket",
    style: "elemental fire",
    description:
      "A small pendant forged from molten lava, radiating intense heat and flickering with fiery hues. This ancient relic grants its wearer resistance to fire and the ability to summon flames at will.",
  },
  {
    name: "Tome of Arcane Wisdom",
    kind: "tome",
    category: "tool",
    style: "wizard",
    description:
      "A massive, leather-bound tome filled with cryptic symbols and arcane formulas. It is said to contain the accumulated wisdom of generations of powerful wizards, granting its reader access to forgotten spells and arcane secrets.",
  },
  {
    name: "Elixir of Eternal Youth",
    kind: "potion",
    category: "consumable",
    style: "mystical",
    description:
      "A shimmering vial filled with a golden elixir, rumored to grant eternal life and youth when consumed. However, it is said that only the worthy and pure of heart can truly harness its extraordinary power.",
  },
  {
    name: "Elven Enchanted Longsword",
    kind: "sword",
    category: "weapon",
    style: "elven",
    description:
      "An elegant elven longsword crafted from enchanted silverwood, its blade gleaming with a faint blue glow. It possesses the ability to cut through magical barriers with ease.",
  },
  {
    name: "Celestial Radiant Amulet",
    kind: "amulet",
    category: "trinket",
    style: "celestial",
    description:
      "A celestial amulet adorned with radiant gemstones, blessed by the gods themselves. When worn, it grants protection against evil forces and empowers divine spellcasting.",
  },
  {
    name: "Dwarven Rune Shield",
    kind: "shield",
    category: "armor",
    style: "dwarven",
    description:
      "A sturdy dwarven shield forged from reinforced mithril, adorned with intricate runes of protection. It provides exceptional defense against physical and magical attacks.",
  },
  {
    name: "Crystal Arcane Wand",
    kind: "wand",
    category: "tool",
    style: "arcane",
    description:
      "A slender wand carved from a rare crystal infused with pure arcane energy. It channels powerful spells, allowing its wielder to unleash devastating magical forces.",
  },
  {
    name: "Mysterious Ancient Scroll",
    kind: "scroll",
    category: "consumable",
    style: "mysterious",
    description:
      "An ancient scroll containing ancient incantations and forbidden knowledge. When deciphered and cast correctly",
  },
  {
    name: "Singing Harp of Elvendom",
    kind: "harp",
    category: "trinket",
    style: "elven",
    description:
      "A beautifully crafted elven harp with strings made of enchanted silver. When played, its ethereal melodies have the power to heal wounds and inspire courage.",
  },
  {
    name: "Dagger of Venom",
    kind: "dagger",
    category: "weapon",
    style: "assassin",
    description:
      "A sleek and deadly dagger with a blade coated in potent venom extracted from the rarest of poisonous creatures. A single scratch can bring certain death to its victim.",
  },
  {
    name: "Ancient Dragon Scale Armor",
    kind: "armor",
    category: "armor",
    style: "dragon",
    description:
      "A suit of armor meticulously crafted from the scales of an ancient dragon. It provides unparalleled protection against physical and elemental attacks, and bestows the wearer with the powers of the mighty beast.",
  },
  {
    name: "Ring of Teleportation",
    kind: "ring",
    category: "trinket",
    style: "arcane",
    description:
      "A golden ring adorned with a single gemstone that glows with an otherworldly light. When activated, it transports the wearer to a chosen destination in an instant.",
  },
  {
    name: "Druidic Staff of Nature",
    kind: "staff",
    category: "weapon",
    style: "druidic",
    description:
      "A wooden staff intricately carved with symbols of nature and adorned with leaves and vines. It channels the primal forces of nature, allowing the wielder to command plants, animals, and the elements.",
  },
  {
    name: "Potion of Invisibility",
    kind: "potion",
    category: "consumable",
    style: "mystical",
    description:
      "A small vial containing a transparent liquid that grants temporary invisibility to the drinker. It allows for stealthy movement and eludes detection from both friend and foe.",
  },
  {
    name: "Giant Slayer Greatsword",
    kind: "greatsword",
    category: "weapon",
    style: "heroic",
    description:
      "A massive greatsword with a blade adorned with ancient inscriptions. It is specifically designed to vanquish giants and deal devastating blows to these towering creatures.",
  },
  {
    name: "Crystal Orb of Divination",
    kind: "orb",
    category: "trinket",
    style: "arcane",
    description:
      "A perfectly smooth crystal orb with a mesmerizing swirling mist within. When gazed into, it reveals glimpses of the past, present, and future, providing insights and foretelling fate.",
  },
  {
    name: "Warhammer of Thunder",
    kind: "warhammer",
    category: "weapon",
    style: "dwarven",
    description:
      "A massive dwarven warhammer infused with the power of thunderstorms. Its strikes create powerful shockwaves and unleash booming thunder, striking fear into the hearts of enemies.",
  },
  {
    name: "Cloak of Elvenkind",
    kind: "cloak",
    category: "armor",
    style: "elven",
    description:
      "A finely woven elven cloak made from the enchanted threads of the mystical silver silk. It grants its wearer the ability to blend seamlessly into natural surroundings, rendering them invisible to prying eyes.",
  },
]

const itemDetailsByLabel: Record<string, string[]> = {
  History: [
    "The item was created to honor a special occasion.",
    "The item was crafted by ancient wizards in a forgotten age.",
    "Legends tell of a great hero who wielded this item in a legendary battle.",
    "The item was once owned by a notorious pirate captain.",
    "This item was passed down through generations in a noble family.",
    "The item was discovered in an ancient tomb, buried with a long-forgotten king.",
    "The item was forged from the remnants of a fallen star.",
    "Scholars believe the item was used by a legendary sorcerer to seal away an ancient evil.",
    "This item was lost for centuries until it was unearthed during a massive excavation.",
    "The item carries a curse that brings misfortune to its owners.",
  ],
  Property: [
    "The item is used to unlock a container, chamber, vault, or other entryway.",
    "The item grants its wielder enhanced strength and agility.",
    "When activated, the item emits a blinding light that dazzles nearby creatures.",
    "The item has the power to heal wounds and cure ailments when touched to the affected area.",
    "The item allows its wielder to communicate with animals and understand their thoughts.",
    "The item creates an impenetrable force field that protects its bearer from harm.",
    "When held, the item grants its wielder the ability to see invisible creatures.",
    "The item can transform into different shapes to suit its wielder's needs.",
    "The item bestows temporary invisibility upon its wielder when activated.",
    "The item has the power to control and manipulate the weather in its vicinity.",
  ],
  Quirk: [
    "The item occasionally hums a soothing melody when held.",
    "When used, the item emits a faint floral scent that lingers in the air.",
    "The item occasionally glows with a soft, pulsating light when in darkness.",
    "The item becomes icy cold to the touch when exposed to extreme heat.",
    "When activated, the item creates a small gust of wind that ruffles nearby objects.",
    "The item releases a burst of colorful sparks when wielded in combat.",
    "When worn, the item grants its bearer the ability to speak and understand any language.",
    "The item emits a faint, otherworldly glow when in the presence of magic.",
    "The item casts a small aura of silence around it, muffling nearby sounds.",
    "When touched, the item imparts a warm and comforting sensation to the bearer.",
  ],
}

export const generateRouter = createTRPCRouter({
  character: publicProcedure.query<CharacterData>(async ({}) => {
    const details = lodash
      .sampleSize(detailsByLabel.valueSeq().toArray(), randomInt(4, 6))
      .map((details) => lodash.sample(details)!)
    const baseData = lodash.sample(charDataStatic)!
    const genResult: CharacterData = {
      ...baseData,
      imagePath: `/portraits/${baseData.race}-${baseData.gender}-${baseData.class}.png`,
      details: details,
    }
    return genResult
  }),
  item: publicProcedure.query<ItemData>(async ({}) => {
    return {
      ...lodash.sample(itemsBasic)!,
      imagePath: "/",
      history: lodash.sample(itemDetailsByLabel.History)!,
      property: lodash.sample(itemDetailsByLabel.Property)!,
      quirk: lodash.sample(itemDetailsByLabel.Quirk)!,
    }
  }),
})
