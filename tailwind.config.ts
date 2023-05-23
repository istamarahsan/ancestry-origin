import { type Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["IM Fell English SC"],
      },
    },
  },
  plugins: [],
} satisfies Config
