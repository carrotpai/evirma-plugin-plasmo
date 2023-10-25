/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "media",
  theme: {
    extend: {
      screens: {
        'xs': '480px'
      },
      boxShadow: {
        'base': '0 0 20px rgba(0,0,0,.1)'
      },
    }
  }
}
