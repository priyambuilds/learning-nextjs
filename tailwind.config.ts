import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // <-- Enable class-based dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        spaceGrotesk: ["var(--font-space-grotesk)"],
      },
    },
  },
  plugins: [
    // List your plugins here, e.g. (add if you use them):
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
  ],
};

export default config;
