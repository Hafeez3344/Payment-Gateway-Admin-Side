/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
    },
    colors: {
      bgYellow: '#facc15', 
      customteal: '#00C2CE14',
      'custom-black-opacity': '#000000B2' ,
      secondary: 'rgba(221, 221, 221, 1)'
    },
  },
  },
  plugins: [],
}