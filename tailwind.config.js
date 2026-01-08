/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Indigo
        secondary: '#a855f7', // Purple
        background: '#0a0a0a',
        surface: '#1a1a1a',
        accent: '#8b5cf6',
      },
      fontFamily: {
        outfit: ['Outfit_400Regular', 'sans-serif'],
        'outfit-bold': ['Outfit_700Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
