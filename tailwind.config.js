/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F353B',
        primary700: '#171F2A',
        secondary: '#B87333',
        'bg-primary': '#141414',
        'text-primary': '#EFEFEF',
        'accent-copper': '#B87333',
        'footer-bg': '#232323',
        secondary700: '#844219',
        secondary300: '#E9BF84',
        cream: '#F8F7F2',
        'dark-bg': '#141414',
        'dark-gray': '#0D0D0D',
        'blue-light': '#5FB2D8',
        'low-light': '#555555',
        'low-medium': '#888888',
        'low-dark': '#EFEFEF',
        gelo: '#f2f2f2',
        'dark-card': '#2F353B',
        'dark-surface': '#181818',
        card: '#1e2023',
      },
      fontFamily: {
        body: ['DM Sans', 'sans-serif'],
        title: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'exg': '3.5rem',
        'xg': '2.25rem',
        'g': '1.5rem',
        'm': '1rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
