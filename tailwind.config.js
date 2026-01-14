export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./*.{js,jsx,ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        baloo: ['"Baloo 2"', 'cursive'],
      },

      // ✅ CORRECT: define colors here
      colors: {
        black: {
          50: "#5F666C",
          100: "#1C2B33",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
