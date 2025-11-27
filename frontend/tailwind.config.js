/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nbeBlue: "#002F6C",
        nbeGold: "#D4AF37",
        nbeNavy: "#001B3A",
        nbeLightGold: "#F2D77C",
      },
    },
  },
  plugins: [],
};
