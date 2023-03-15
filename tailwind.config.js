/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/client/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D0FE42",
          50: "#FDFFF9",
          100: "#F8FFE4",
          200: "#EEFFBC",
          300: "#E4FE93",
          400: "#DAFE6B",
          500: "#D0FE42",
          600: "#C2FE0A",
          700: "#9CCF01",
          800: "#729701",
          900: "#485F01",
        },
        dark: "#131313",
        light: "#ebebeb",
      },
    },
  },
  plugins: [],
};
