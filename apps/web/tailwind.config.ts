import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: "#16201B",
        parchment: "#F7F3EA",
        linen: "#FCFAF5",
        moss: "#315C4A",
        emerald: "#0F8A64",
        gold: "#C69A47"
      },
      fontFamily: {
        syne: ["Syne", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
