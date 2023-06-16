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
  plugins: [
    // https://stackoverflow.com/questions/67119992/how-to-access-all-the-direct-children-of-a-div-in-tailwindcss
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
    },
  ],
};
