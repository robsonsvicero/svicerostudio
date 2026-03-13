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
        'footer-bg': '#2F353B',
        secondary700: '#844219',
        secondary300: '#E9BF84',
        cream: '#F8F7F2',
        'dark-bg': '#141414',
        'dark-gray': '#0D0D0D',
        'blue-light': '#5FB2D8',
        'low-light': '#555555',
        'low-medium': '#888888',
        'low-dark': '#EFEFEF',
        gelo: '#242424',
        'dark-card': '#2F353B',
        'dark-surface': '#181818',
      },
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        title: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        exg: '5.6rem',
        xg: '4.4rem',
        g: '2.4rem',
        m: '1.6rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
