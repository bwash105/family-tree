import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-quicksand)', 'sans-serif'],
        display: ['var(--font-caveat)', 'cursive'],
      },
      colors: {
        cream: '#FFFBF5',
        brown: {
          DEFAULT: '#92400E',
          light: '#B45309',
          dark: '#78350F',
        },
      },
    },
  },
  plugins: [],
};
export default config;
