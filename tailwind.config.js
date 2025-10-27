/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          100: "#A5B2A0",
          200: "#5C6E58",
          300: "#A4CE94",
          400: "#50A078",
        },
        cream: {
          100: "#F6F2E7",
          200: "#E5D2B8",
        },
        brown: {
          100: "#EAD3B0",
          200: "#D6AE7B",
          300: "#9C6C44",
          400: "#D19C6B",
          600: "#5E483C",
          800: "#4A2505",
        },
        gray: {
          300: "#D1D5DB",
          unselected: "#A8A8A8",
          100: "#D9D9D9",
          input: "#F3F3F3",
        },
        loginbg: "#F7F8FA",
        black: {
          DEFAULT: "#000000",
          65: "rgba(0,0,0,0.65)",
          49: "rgba(0,0,0,0.49)",
          40: "rgba(0,0,0,0.4)",
          72: "rgba(60,60,67,0.72)",
        },
      },
    },
  },
  plugins: [],
};
