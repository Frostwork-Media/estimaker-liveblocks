/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Bricolage Grotesque", "sans-serif"],
        mono: ["Martian Mono", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      colors: {
        background: "#fcfcfc",
        foreground: "#1c1717",
        neutral: {
          50: "#fafafa",
          100: "#f5f4f4",
          200: "#e7e6e6",
          300: "#d6d4d4",
          400: "#a5a2a2",
          500: "#757272",
          600: "#575353",
          700: "#443f3f",
          800: "#2b2626",
          900: "#1c1717",
        },
        green: {
          DEFAULT: "#2fbe6f",
          50: "#eefdf3",
          100: "#d6fbe0",
          200: "#b0f5c7",
          300: "#7beaa9",
          400: "#4bd787",
          500: "#2fbe6f",
          600: "#26995b",
          700: "#1e794c",
          800: "#195f3e",
          900: "#154e34",
        },
        red: {
          DEFAULT: "#ef3e36",
          50: "#fef2f2",
          100: "#fde1e0",
          200: "#fdc9c7",
          300: "#fba3a0",
          400: "#f86e68",
          500: "#ef3e36",
          600: "#dc2011",
          700: "#b9190b",
          800: "#991b12",
          900: "#7f1e18",
        },
        blue: {
          DEFAULT: "#00a6f3",
          50: "#f0f9ff",
          100: "#e1f2ff",
          200: "#bde7ff",
          300: "#82d4ff",
          400: "#3abeff",
          500: "#00a6f3",
          600: "#0784ce",
          700: "#0c69a5",
          800: "#0f5887",
          900: "#12496f",
        },
        yellow: {
          DEFAULT: "#fbec5e",
          50: "#fcfde9",
          100: "#fdfdc8",
          200: "#fcf895",
          300: "#fbec5e",
          400: "#f7d736",
          500: "#e6bc24",
          600: "#c7900e",
          700: "#9f6602",
          800: "#835007",
          900: "#6f410c",
        },
        orange: {
          DEFAULT: "#ff8c42",
          50: "#fff7ee",
          100: "#ffecd7",
          200: "#ffd5ad",
          300: "#ffb779",
          400: "#ff8c42",
          500: "#fc6d2a",
          600: "#ec5228",
          700: "#c33d23",
          800: "#9b3120",
          900: "#7d2b1c",
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

/**
 * TO USE:
 *
 * <body class="bg-background text-foreground dark:bg-foreground dark:text-background"></div>
 */
