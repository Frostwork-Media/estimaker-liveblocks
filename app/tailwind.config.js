/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // for squiggle-components
    "./node_modules/@quri/squiggle-components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Wix Madefor Text", "sans-serif"],
      },
      colors: {
        background: "#fafafa",
        foreground: "#3d3d3e",
        neutral: {
          50: "#fafafa",
          100: "#f3f3f3",
          200: "#e3e3e3",
          300: "#d0d0d1",
          400: "#9e9e9f",
          500: "#6f6f6f",
          600: "#505051",
          700: "#3d3d3e",
          800: "#262627",
          900: "#181819",
        },
        red: {
          DEFAULT: "#f45b42",
          50: "#fff7ef",
          100: "#ffefdf",
          200: "#ffdabc",
          300: "#ffbe90",
          400: "#ff9763",
          500: "#ff794e",
          600: "#f45b42",
          700: "#c84135",
          800: "#9d332b",
          900: "#7d2a22",
        },
        blue: {
          DEFAULT: "#35a3ce",
          50: "#eff9fe",
          100: "#def1fb",
          200: "#b9e5f5",
          300: "#81d1ec",
          400: "#4bbbe1",
          500: "#35a3ce",
          600: "#1585b3",
          700: "#006a94",
          800: "#005b7c",
          900: "#004c69",
        },
        green: {
          DEFAULT: "#3ca170",
          50: "#edfdf4",
          100: "#d7fde6",
          200: "#b3f9d2",
          300: "#84efba",
          400: "#5bdd9d",
          500: "#49c487",
          600: "#3ca170",
          700: "#277e59",
          800: "#196145",
          900: "#0e4e38",
        },
        cyan: {
          DEFAULT: "#d5dee0",
          50: "#effafd",
          100: "#e6f0f3",
          200: "#d5dee0",
          300: "#b4c9ce",
          400: "#91b5be",
          500: "#71a2b0",
          600: "#4d8599",
          700: "#2c6c82",
          800: "#0c5c72",
          900: "#004d61",
        },
        yellow: {
          DEFAULT: "#ffe713",
          50: "#fdfce8",
          100: "#fdfcc3",
          200: "#fdf583",
          300: "#ffe713",
          400: "#f9d200",
          500: "#e8b800",
          600: "#c88e00",
          700: "#a06500",
          800: "#844e02",
          900: "#70400e",
        },
      },
    },
  },
  plugins: [],
};
