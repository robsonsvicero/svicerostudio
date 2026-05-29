/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        // ─────────────────────────────────────────────
        // NOVO DESIGN SYSTEM — Svicero Studio (Fase 2)
        // Paleta: Estratégia & Design de Marcas
        // ─────────────────────────────────────────────

        // Fundos
        'ds-bg':        '#FAF7F2', // Background principal (off-white quente)
        'ds-surface':   '#FFFFFF', // Superfícies, cards, modais

        // Textos
        'ds-text':      '#222222', // Texto principal (quase preto orgânico)
        'ds-muted':     '#6B7280', // Texto secundário / placeholders

        // Destaque principal — coral/laranja (ação, CTA, ponto do logo)
        'ds-accent':         '#FF7A59',
        'ds-accent-hover':   '#E8633F', // Hover do coral

        // Destaque secundário — azul tech (dados, IA, gráficos, fluxos)
        'ds-tech':           '#3B82F6',
        'ds-tech-hover':     '#2563EB', // Hover do azul

        // Estrutura — bordas, cards, divisórias
        'ds-border':    '#E2E4E8',
        'ds-divider':   '#D1D5DB',

        //background Outline
        'ds-outline': '#ffffff',
        'ds-outline-hover': '#f2f2f2',

        // ─────────────────────────────────────────────
        // LEGADO — mantido para evitar quebra em rotas
        // não afetadas pela nova identidade visual
        // ─────────────────────────────────────────────

        // charcoal:            '#0D0D0D',
        // surface:             '#141414',
        // card:                '#1E2023',
        // cream:               '#FAFAF8',
        // muted:               '#8A8F98',
        // copper:              '#B87333',
        // 'copper-light':      '#E9BF84',
        // copper700:           '#844219',
        // copper300:           '#E9BF84',
        // primary:             '#2F353B',
        // primary700:          '#171F2A',
        // gelo:                '#f2f2f2',
        // dim:                 '#555555',
        // secondary:           '#B87333',
        // 'bg-primary':        '#141414',
        // 'text-primary':      '#EFEFEF',
        // 'accent-copper':     '#B87333',
        // 'footer-bg':         '#232323',
        // secondary700:        '#844219',
        // secondary300:        '#E9BF84',
        // 'dark-bg':           '#141414',
        // 'dark-gray':         '#0D0D0D',
        // 'blue-light':        '#5FB2D8',
        // 'low-light':         '#555555',
        // 'low-medium':        '#888888',
        // 'low-dark':          '#EFEFEF',
        // 'dark-card':         '#2F353B',
        // 'dark-surface':      '#181818',
      },

      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        title:   ['Inter', 'sans-serif'],
      },

      fontSize: {
        'exg': '3.5rem',
        'xg':  '2.25rem',
        'g':   '1.5rem',
        'm':   '1rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}