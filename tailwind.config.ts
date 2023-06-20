import { type Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["IM Fell English SC"],
        serifSub: ["Abhaya Libre"],
      },
      colors: {
        nightingale: "#5E4529",
        vanilla: "#C8B6A6",
        rosewood: "#5C0404",
      }
    },
  },
  plugins: [],
} satisfies Config
