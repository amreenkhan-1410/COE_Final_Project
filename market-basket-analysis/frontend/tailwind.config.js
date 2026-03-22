/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F6F5E',
        'primary-dark': '#184F44',
        accent: '#E7A16E',
        'accent-strong': '#C96B3F',
        surface: '#F7F3EC',
        ink: '#21313B',
        mist: '#EAF1EB',
        card: '#FFFFFF',
      },
      boxShadow: {
        premium: '0 24px 80px rgba(30, 44, 52, 0.14)',
      },
    },
  },
  plugins: [],
}
