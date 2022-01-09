const widthHeight = {};
for (let i = 1; i <= 1000; i++) {
  widthHeight[i] = `calc(${i}px * var(--img-scale))`;
}

module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        bg: "#202020",
      },
      width: {
        ...widthHeight,
      },
      height: {
        ...widthHeight,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
