/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'flavor-bg': 'hsl(35, 74%, 90%)',
        'flavor-bg-2': 'hsl(39, 52%, 80%)',
        'flavor-text-header': 'hsl(348, 28%, 24%)',
        'flavor-text-body': 'hsl(7, 40%, 25%)',
        'flavor-text-muted': 'hsl(7, 14%, 37%)',
        'flavor-red': 'hsl(356, 49%, 43%)',
        'flavor-green': 'hsl(105, 44%, 35%)',
        'flavor-blue': 'hsl(214, 39%, 39%)',
        'flavor-yellow': 'hsl(31, 63%, 46%)',
        'flavor-brown': 'hsl(23, 34%, 51%)',
        'flavor-tan': 'hsl(39, 52%, 80%)',
      },
      fontFamily: {
        'jua': ['Jua', 'cursive'],
        'sour': ['Sour Gummy', 'sans-serif'],
      },
      borderRadius: {
        'flavor': '0.8rem',
      },
      boxShadow: {
        'flavor': '0px 0px 2px 1px hsla(0, 0%, 0%, 0.25)',
      },
    },
  },
  plugins: [],
}
