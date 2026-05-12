/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores do Novo Design System (ds_original.html)
        charcoal: '#0D0D0D', // Fundo Principal
        surface: '#141414',  // Elevações base
        card: '#1E2023',     // Cards
        cream: '#FAFAF8',    // Textos principais
        muted: '#8A8F98',    // Textos secundários
        copper: '#B87333',   // Destaque Primário
        'copper-light': '#E9BF84', // Gradientes/Hover

        // Mantendo cores originais como legado para evitar quebra em rotas não afetadas
        copper700: '#844219',
        copper300: '#E9BF84',
        primary: '#2F353B',
        primary700: '#171F2A',
        gelo: '#f2f2f2',
        dim: '#555555',
        secondary: '#B87333',
        'bg-primary': '#141414',
        'text-primary': '#EFEFEF',
        'accent-copper': '#B87333',
        'footer-bg': '#232323',
        secondary700: '#844219',
        secondary300: '#E9BF84',
        'dark-bg': '#141414',
        'dark-gray': '#0D0D0D',
        'blue-light': '#5FB2D8',
        'low-light': '#555555',
        'low-medium': '#888888',
        'low-dark': '#EFEFEF',
        'dark-card': '#2F353B',
        'dark-surface': '#181818',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        title: ['Inter', 'sans-serif'],
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
