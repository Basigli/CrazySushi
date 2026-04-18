/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Manrope", "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
      },
      boxShadow: {
        soft: "0 12px 28px -16px rgba(2, 6, 23, 0.5)",
      },
    },
  },
  plugins: [],
}

