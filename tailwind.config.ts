import { type Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["IM Fell English SC"],
        serifSub: ["Abhaya Libre"],
      },
    },
  },
  plugins: [],
} satisfies Config
