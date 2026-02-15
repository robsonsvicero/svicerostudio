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
        secondary: '#B87333',
        'bg-primary': '#F9F7F2',
        'text-primary': '#2F353B',
        'accent-copper': '#B87333',
        'footer-bg': '#EAE7E1',
        secondary300: '#E9BF84',
        cream: '#F9F7F2',
        'dark-bg': '#F9F7F2',
        'dark-gray': '#1a1a1a',
        'blue-light': '#5FB2D8',
        'low-light': '#8A847D',
        'low-medium': '#5F5A53',
        'low-dark': '#2F353B',
        gelo: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Manrope', 'sans-serif'],
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
