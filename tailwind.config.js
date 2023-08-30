/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      rotate: {
        '20': '20deg',
      },
      colors: {
        MainGreen: {
          100: "#E6EEE5",
          200: "#BBD6A0",
          300: "#3EA635",
        },
        MainGray: {
          100: "#646363",
          200: "#8ea29c",
        },
      },
    },
  },

  plugins: [],
};
