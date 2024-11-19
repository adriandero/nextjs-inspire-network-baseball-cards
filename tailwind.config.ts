import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#F0A16B",
        secondary:"#345569",
        tertiary:"#438692",
        dark1:"#2A2A2A",
        dark2:"#393838",
        dark3:"#5D5D5D",
        light1:"#FFFFFF",
        light2:"#F2F2F2",
        light3:"#DCDCDC",
      },
    },
  },
  plugins: [],
  
} satisfies Config;
