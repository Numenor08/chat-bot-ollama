import type { Config } from "tailwindcss";

export default {
  darkMode: 'selector',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        light: "rgb(236,236,236)",
        dark: "rgb(33,33,33)",
        darkChat: 'rgb(48,48,48)',
      },
      backgroundImage: {
        darkModeBackground: "url('/bg-black.png')",
        lightModeBackground: "url('/bg-white.png')",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
