/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Add all relevant file types here
  ],
  theme: {
    extend: {
      fontFamily: {
        "font-primary": "var(--font-primary)",
        secondary: "var(--font-secondary)",
        emphasis: "var(--font-emphasis)",
        body: "var(--font-body)",
      },
      colors: {
        "color-primary": "var(--color-primary)",
        "color-primary-hover": "var(--color-primary-hover)",
        text: "var(--color-text)",
        bg: "var(--color-bg)",
        pageBg: "var(--color-page-bg)",
        highlight: "var(--color-highlight)",
        positive: "var(--color-positive)",
        negative: "var(--color-negative)",
      },
    },
  },
  plugins: [],
};
