/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "solid-inset-1": "inset 0px 0px 0px 1px rgba(0, 0, 0, 0.3)",
      },
      minWidth: {
        25: "25rem",
      },
    },
  },
  plugins: [],
};
