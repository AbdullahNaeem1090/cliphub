
/** @type {import('tailwindcss').Config} */
import plugin from "flowbite/plugin"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite/**/*.{js,jsx,ts,tsx}" 
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin
  ],
};
