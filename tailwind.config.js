/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        creme: "#F4EDE0",
        beige: "#EFE6CF",
        terra: "#C96F4A",
        rost: "#9D3D2C",
        senf: "#D9A441",
        salbei: "#8A9B6E",
        tinte: "#4A3728",
        holz: "#A67C52",
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        serif: ["Georgia", "'Times New Roman'", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "'Segoe UI'", "Roboto", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
