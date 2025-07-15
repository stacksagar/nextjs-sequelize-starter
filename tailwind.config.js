/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkMinimalism: "#121212",
        darkNeon: "#0D0D0D",
        darkWarm: "#1C1C1C",
        darkMuted: "#2C2C2C",
        darkDeep: "#1A1A1A",
        darkContrasting: "#181818",

        lightMinimalism: "#E0E0E0",
        lightNeon: "#FFFFFF",
        lightWarm: "#F5E8D8",
        lightMuted: "#E4E4E4",
        lightDeep: "#F0F0F0",
        lightContrasting: "#F7F7F7",

        dark2: "#3F2E3E",
        dark3: "#4B3B4C",
        dark4: "#635363",
        dark5: "#7A6A7B",
        dark6: "#928293",

        light: "#F9F5F6",
        light2: "#F3EEF0",
        light3: "#EEE4E9",
        light4: "#E8D9DE",
        light5: "#E2CDD3",
        light6: "#DCC2CB",
        light7: "#D6B7C3",

        darkblue: "#0C134F",
        darkblue2: "#1A246C",
        darkblue3: "#283589",
        darkblue4: "#3646A6",
        darkblue5: "#4457C3",
        darkblue6: "#5268E0",
        darkblue7: "#6079FD",
      },
    },
  },
  plugins: [],
};
