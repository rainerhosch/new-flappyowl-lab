/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Green: "#1fdf64",
        Black: "#000",
        DeepNightBlack: "#121212",
        MidNightBlack: "#181818",
        EveningBlack: "#1a1a1a",
        DarkGray: "#282828",
        SlateGray: "#404040",
        LightGray: "#959595",
        SnowTransparent: "#ffffff52",
        SilverGray: "#B3B3B3",
        Snow: "#ffffff",
        RedSuprime:"#ff2a2a",
        RedSuprime2:"#ef3333",
        RedSuprimeDark:"#db0000",
        Rose:"#ff8787",
        BlueBase:"#1054ff",
        BlueSoft:"#346dff",
        BluePastel:"#436cff",
        NavLink:"#91b0ff",
      },
      fontFamily: {
        'cascadia-normal': ['cascadia-normal'],
        'circular': ['circular-normal', 'sans-serif'],
        'circular-light': ['circular-light', 'sans-serif'],
        'circular-normal': ['circular-normal', 'sans-serif'],
        'circular-medium': ['circular-medium', 'sans-serif'],
        'circular-bold': ['circular-bold', 'sans-serif'],

      },
      perspective: {
        'carousel': '300px', // Adjust as needed
      },
    },
  },
}