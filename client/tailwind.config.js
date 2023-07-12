/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#331D2C',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
};

