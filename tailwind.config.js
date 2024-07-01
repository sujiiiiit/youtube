/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    //custom-fonts
    fontFamily: {
      Geist: ['"Geist"', "sans-serif"],
      GeistMono: ['"GeistMono"', "sans-serif"],
    },
    extend: {
      //custom colors
      colors: {
        Primary: "var(--txtPrimary)",
        Secondary: "var(--txtSecondary)",
      },
      //custom screen sizes
      screens: {
        xs: {
          raw: "(max-width: 600px)",
          
        },
        mdd:{
          raw: "(max-width: 810px)",
        },
      },
    },
  },
  plugins: [],
};
