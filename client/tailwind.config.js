/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10B981", // Emerald Green
        background: "#FFFFFF",
        text: "#111827", // Near Black
        accent: "#1F2937", // Dark Charcoal
        muted: "#6B7280", // Slate Gray
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
