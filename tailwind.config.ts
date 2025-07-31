import type { Config } from "tailwindcss";
const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        spaceGrotesk: ["var(--font-space-grotesk)"],
      },
    },
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
};
export default config;
