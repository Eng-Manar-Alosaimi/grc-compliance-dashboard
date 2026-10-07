/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgb(255 255 255 / 0.04), 0 8px 24px -12px rgb(0 0 0 / 0.55)",
      },
    },
  },
  plugins: [],
};
